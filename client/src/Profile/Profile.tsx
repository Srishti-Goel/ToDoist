import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import UserNeeded from "../UserNeeded";
import HobbyForm from "./HobbyForm";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import HobbyDisplay from "./HobbyDisplay";

const serverUrl = "http://localhost:3000";

const Profile: React.FC = () => {
    const { user } = useUser();
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newHobby, setNewHobby] = useState("");
    const [newColor, setNewColor] = useState("#007bff");
    const [mainImage, setMainImage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [editingHobby, setEdittingHobby] = useState(false)

    useEffect(() => {
        if (user?.email) {
            axios.get(serverUrl+'/hobbies', { params: { userEmail: user.email } })
                .then(res => setHobbies(res.data))
                .catch(() => setHobbies([]))
                .finally(() => setLoading(false));
        } else {
            setHobbies([]);
            setLoading(false);
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            // Refresh hobbies list
            const res = await axios.get(serverUrl+'/hobbies', { params: { userEmail: user?.email } });
            setHobbies(res.data);
        } catch (err: any) {
            console.log("Error refreshing page:", err);
        }
    }

    const handleAddHobby = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!newHobby.trim() || !mainImage.trim()) {
            setFormError("Hobby name and main image are required.");
            return;
        }
        setAdding(true);
        try {
            await axios.post(serverUrl+'/hobbies/add', {
                userEmail: user?.email,
                name: newHobby,
                color: newColor,
                inspirationImages: [],
                mainImage
            });
            setShowForm(false);
            setNewHobby("");
            setMainImage("");
            setNewColor("#007bff");
            handleUpdate();
        } catch (err: any) {
            setFormError(err?.response?.data?.message || "Failed to add hobby.");
        }
        setAdding(false);
    };

    if (!user) {
        console.error("User context is not available");
        return <UserNeeded />;
    }

    return (
        <div className="container py-4" style={{ color: "var(--palette-4)", maxWidth: 600 }}>
            <div className="d-flex align-items-center mb-4">
                <FaUserCircle size={64} style={{ color: "var(--palette-4)", marginRight: 20 }} />
                <div>
                    <h2 className="mb-1" style={{ fontWeight: 700, color: "var(--palette-4)" }}>Profile</h2>
                    <div style={{ fontSize: "1.1rem" }}>
                        <strong>Name:</strong> {user?.name || "Not logged in"}
                    </div>
                    <div style={{ fontSize: "1.1rem" }}>
                        <strong>Email:</strong> {user?.email || "Not logged in"}
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0" style={{ fontWeight: 600 }}>Hobbies</h4>
                <button
                    className="btn btn-sm ms-2"
                    style={{
                        background: "var(--palette-4)",
                        color: "var(--palette-1)",
                        border: "none",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    title="Add Hobby"
                    onClick={() => setShowForm(v => !v)}
                >
                    <FaPlus />
                </button>
            </div>
            {showForm 
            && 
                <HobbyForm
                    handleSubmit={handleAddHobby}
                    handleClose={() => setShowForm(false)}
                    formError={formError}
                    loading={adding}
                    fields={[
                        {label: "Hobby Name", type: "text", value: newHobby, onChange:setNewHobby},
                        {label: "Color", type: "color", value: newColor, onChange:setNewColor, style: { width: 50, height: 34, padding: 0, border: "none", background: "transparent" }},
                        {label: "Main Image URL", type: "url", value: mainImage, onChange:setMainImage},
                    ]}
                />
            }
            {loading ? (
                <div>Loading hobbies...</div>
            ) : hobbies.length === 0 ? (
                <div className="text-muted" style={{ color: "var(--palette-4)" }}>No hobbies found.</div>
            ) : (
                <ul className="list-group">
                    {hobbies.map((hobby, idx) => (
                        <HobbyDisplay handleUpdate={handleUpdate} hobby={hobby} idx={idx+hobbies.length}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Profile;