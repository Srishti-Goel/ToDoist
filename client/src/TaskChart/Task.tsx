import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Draggable } from "@hello-pangea/dnd";
import { useUser } from '../UserContext';
import { FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import UserNeeded from "../UserNeeded";
import Form from "../utils/Form";

interface TaskProps {
    id: string;
    title: string;
    description: string;
    status?: string;
    onUpdateTask?: () => void;
    index?: number;
    hobby?: string;
}

function Task({ id, title, description, index, status, onUpdateTask, hobby }: TaskProps) {
    const [editing, setEditing] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(title);
    const [editedDescription, setEditedDescription] = React.useState(description);
    const [hobbyState, setHobbyState] = React.useState(hobby || "Work");
    const [loading, setLoading] = React.useState(false);
    const [errorStr, setErrorStr] = React.useState<string | null>(null);
    const { user } = useUser();

    if (!user) {
        console.error("User context is not available");
        return <UserNeeded />;
    }

    const formFields = [
        {
            name: "title",
            label: "Title",
            type: "text",
            placeholder: "Title",
            value: editedTitle,
            onChange: setEditedTitle,
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            placeholder: "Description",
            value: editedDescription,
            onChange: setEditedDescription,
        },
        {
            name: "hobby",
            label: "Hobby",
            type: "text",
            placeholder: "Hobby",
            value: hobbyState,
            onChange: setHobbyState,
        }
    ];

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorStr(null);
        axios.post(`http://localhost:3000/updatetask/${id}`, {
            title: editedTitle,
            description: editedDescription,
            status: status,
            hobby: hobbyState,
            userEmail: user.email
        })
        .then(() => {
            setEditing(false);
            if (onUpdateTask) onUpdateTask();
        })
        .catch((error) => {
            setErrorStr("Error updating task");
            console.error(`Error updating task ${id}:`, error);
        })
        .finally(() => setLoading(false));
    };

    const handleDoubleClick = () => {
        setEditing(!editing);
        // Optionally, you can auto-save on double click out of edit mode
        // if (!editing) handleSave({} as React.FormEvent);
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        axios.get(`http://localhost:3000/deletetask/${id}`, {
            params: { userEmail: user.email }
        })
        .then(() => {
            setEditing(false);
            if (onUpdateTask) onUpdateTask();
        })
        .catch((error) => {
            setErrorStr("Error deleting task");
            console.error(`Error deleting task ${id}:`, error);
        });
    };

    let taskContent;
    if (editing) {
        taskContent = (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="alert alert-warning py-1 px-2 mb-0 flex-grow-1" role="alert" style={{ fontSize: "0.95rem" }}>
                        <strong>Editing Mode</strong>
                    </div>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={handleDelete}
                        title="Delete Task"
                        style={{ height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center", opacity: "80%" }}
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
                <Form
                    fields={formFields}
                    onSubmit={handleSave}
                    submitButtonName="Save"
                    loading={loading}
                    errorStr={errorStr || undefined}
                    errorPresent={!!errorStr}
                    className="mb-2"
                />
            </div>
        );
    } else {
        taskContent = (
            <div>
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="card-title mb-1 fw-semibold text-truncate" title={title} style={{ maxWidth: "70%" }}>
                        {title}
                    </h5>
                    {hobby && (
                        <span
                            className="badge bg-secondary ms-2"
                            style={{
                                fontSize: "0.85rem",
                                background: "var(--palette-4)",
                                color: "#fff",
                                minWidth: "fit-content"
                            }}
                            title={hobby}
                        >
                            {hobby.slice(0, 6)}
                        </span>
                    )}
                </div>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.97rem", minHeight: "1.5em", wordBreak: "break-word" }}>
                    {description || <span className="fst-italic text-secondary">No description</span>}
                </p>
            </div>
        );
    }

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    className="card mb-2 border-0"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="card-body p-2 rounded-2" style={{ background: "var(--palette-1)" }}>
                        {taskContent}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default Task;