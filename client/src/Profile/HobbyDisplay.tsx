import React, { useState } from "react";
import { useUser } from "../UserContext";
import axios from "axios";

import HobbyForm from "./HobbyForm";

const serverUrl = "http://localhost:3000";

interface hobbyDisplayDets {
    handleUpdate?: () => void;
    hobby: any;
    idx: number;
}

const HobbyDisplay: React.FC<hobbyDisplayDets> = ({
    handleUpdate, hobby, idx
}) => {
    const [expanded, setExpanded] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hobbyName, setHobbyName] = useState(hobby.name);
    const [hobbyColor, setHobbyColor] = useState(hobby.color);
    const [hobbyMain, setHobbyMain] = useState(hobby.mainImage);
    const [hobbyIP, setHobbyIP] = useState(hobby.inspirationImages);
    const {user} = useUser();

    const handleDoubleClick = () => {
        setExpanded(!expanded);
        setFormError(null);
    }

    const handleLocalUpdate = (e: React.FormEvent) => {
        if (!user) {
            return;
        }
        e.preventDefault();
        setLoading(true);
        setFormError(null);
        axios.put(serverUrl + "/hobbies/update", {
            userEmail: user.email,
            hobbyId: hobby._id,
            name: hobbyName,
            color: hobbyColor,
            inspirationImages: hobbyIP,
            mainImage: hobbyMain 
        })
        .then(() => {
            setExpanded(false);
            if (handleUpdate) handleUpdate();
        })
        .catch((err) => {
            setFormError("ERROR: " + err.response.data.message);
            console.error(`Error updating hobby ${idx} named ${hobby.name}`, err);
        })
        .finally(() => setLoading(false));
    }

    const handleDelete = () => {
        if (!user) {
            return;
        }

        // Setting the loading to true:
        setLoading(true);
        setFormError(null);
        axios.get(serverUrl + `/hobbies/delete/${hobby._id}`, {
            params: {userEmail: user.email}
        })
        .then(() => {
            setExpanded(false);
            if (handleUpdate) handleUpdate();
        })
        .catch((err) => {
            setFormError("ERROR: " + err.response.data.message);
            console.error(`Error updating hobby ${idx} named ${hobby.name}`, err);
        })
        .finally(() => setLoading(false));
    }

    let edit_form = (
        <div className="mt-2">
            <HobbyForm
                handleSubmit={handleLocalUpdate}
                handleClose={() => setExpanded(false)}
                handleDelete={handleDelete}
                formError={formError}
                loading={loading}
                fields={[
                    { label: "Hobby Name", type: "text", value: hobbyName, onChange: setHobbyName },
                    { label: "Color", type: "color", value: hobbyColor, onChange: setHobbyColor, style: { width: 50, height: 34, padding: 0, border: "none", background: "transparent" } },
                    { label: "Main Image URL", type: "url", value: hobbyMain, onChange: setHobbyMain },
                ]}
            />
        </div>
    ); /* TODO: Add inspirational images "extraField" */

    return (
        <li
            className="list-group-item"
            key={idx}
            onDoubleClick={handleDoubleClick}
            style={{
                color: "var(--palette-4)",
                background: "var(--palette-1)",
                border: "1px solid var(--palette-3)",
                fontWeight: 500,
                fontSize: "1.05rem"
            }}
        >
            <div className="d-flex align-items-center">
                <img
                    src={hobby.mainImage || ""}
                    alt={hobby.name}
                    style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    minWidth: "20px",
                    minHeight: "20px",
                    }}
                />
                {hobby.name}
            </div>
            {expanded && edit_form}
        </li>
    );
};

export default HobbyDisplay;
