import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Draggable } from "@hello-pangea/dnd";
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";

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
    const navigate = useNavigate();

    if (!user) {
        console.error("User context is not available");
        return <div className="alert alert-danger" role="alert">User context is not available.</div>;
    }

    const handleDoubleClick = () => {
        setEditing(true);
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
                <div className="alert alert-warning" role="alert">
                    <strong>Editing Mode:</strong>
                </div>
                <form onSubmit={handleSave}>
                    <div className="form-outline mb-4">
                        <label htmlFor={`task-title-${id}`} className="form-label">Title</label>
                        <input
                            type="text"
                            id={`task-title-${id}`}
                            className="form-control"
                            placeholder="Title"
                            onChange={e => setEditedTitle(e.target.value)}
                            value={editedTitle}
                        />
                    </div>
                    <div className="form-outline mb-4">
                        <label htmlFor={`task-description-${id}`} className="form-label">Description</label>
                        <input
                            type="text"
                            id={`task-description-${id}`}
                            className="form-control"
                            placeholder="Description"
                            onChange={e => setEditedDescription(e.target.value)}
                            value={editedDescription}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary ms-4 p-2"><FaCheck size={20} /></button>
                    <button type="button" className="btn btn-danger ms-4 p-2" onClick={handleDelete}><FaTrash size={20} /></button>
                </form>
            </div>
        );
    } else {
        taskContent = (
            <div>
                <h5 className="card-title mb-1">{title}</h5>
                <p className="card-text mb-1">{description}</p>
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