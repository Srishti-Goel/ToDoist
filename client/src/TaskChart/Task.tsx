import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Draggable } from "@hello-pangea/dnd";
import { useUser } from '../UserContext';
import { FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import UserNeeded from "../UserNeeded";

interface TaskProps {
    id: string;
    title: string;
    description: string;
    status: string;
    onUpdateTask?: () => void;
    index: number;
}

function Task({ id, title, description, index, status, onUpdateTask }: TaskProps) {
    const [editing, setEditing] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(title);
    const [editedDescription, setEditedDescription] = React.useState(description);
    const { user } = useUser();

    if (!user) {
        console.error("User context is not available");
        return <UserNeeded />;
    }

    const handleDoubleClick = () => {
        setEditing(!editing);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post(`http://localhost:3000/updatetask/${id}`, {
            title: editedTitle,
            description: editedDescription,
            status: status,
            userEmail: user.email
        })
        .then(() => {
            setEditing(false);
            if (onUpdateTask) onUpdateTask();
        })
        .catch((error) => {
            console.error(`Error updating task ${id}:`, error);
        });
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
                        style={{ height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center", opacity: "80%"}}
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
                <form onSubmit={handleSave}>
                    <div className="row align-items-center mb-3">
                        <label htmlFor={`task-title-${id}`} className="col-3 col-form-label text-end pe-2">Title</label>
                        <div className="col-9">
                            <input
                                type="text"
                                id={`task-title-${id}`}
                                className="form-control"
                                placeholder="Title"
                                onChange={e => setEditedTitle(e.target.value)}
                                value={editedTitle}
                            />
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <label htmlFor={`task-description-${id}`} className="col-3 col-form-label text-end pe-2">Details</label>
                        <div className="col-9">
                            <input
                                type="text"
                                id={`task-description-${id}`}
                                className="form-control"
                                placeholder="Description"
                                onChange={e => setEditedDescription(e.target.value)}
                                value={editedDescription}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary ms-2 p-2">
                            <FaCheck size={18} /> Save
                        </button>
                    </div>
                </form>
            </div>
        );
    } else {
        taskContent = (
            <div>
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="card-title mb-1 fw-semibold text-truncate" title={title} style={{ maxWidth: "80%" }}>
                        {title}
                    </h5>
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