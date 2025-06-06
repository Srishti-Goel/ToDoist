import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressColumn from "./ProgressColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useUser } from '../UserContext';
import axios from "axios";
import UserNeeded from "../UserNeeded";
import ImageCarousel from "../ImageCarousel/ImageCarousel"; // <-- Import the carousel

export const TaskStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE"
} as const;
type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

type Task = {
    id: string;
    title: string;
    description: string;
    status?: TaskStatus;
    [key: string]: any;
};

type TaskChartProps = {
    hobby?: any;
};

function TaskChart({ hobby }: TaskChartProps) {
    const [toDoTasks, setToDoTasks] = React.useState<Task[]>([]);
    const [inProgressTasks, setInProgressTasks] = React.useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);
    const { user } = useUser();

    // Add state for showing the carousel
    const [showCarousel, setShowCarousel] = useState(false);

    // Fetch tasks for the user
    useEffect(() => {
        if (!user) return;
        axios.get('http://localhost:3000/tasks', {
            params: { userEmail: user.email, hobby: hobby.name } // Pass hobby if provided
        })
        .then((response) => {
            setToDoTasks(response.data.ToDoTasks || []);
            setInProgressTasks(response.data.InProgressTasks || []);
            setDoneTasks(response.data.DoneTasks || []);
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    }, [user, hobby]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        // Find the dragged task and its current list
        let draggedTask: Task | undefined;
        let sourceList: Task[] = [];
        let setSourceList: React.Dispatch<React.SetStateAction<Task[]>> = () => {};
        let setDestList: React.Dispatch<React.SetStateAction<Task[]>> = () => {};

        if (source.droppableId === TaskStatus.TODO) {
            sourceList = toDoTasks;
            setSourceList = setToDoTasks;
        } else if (source.droppableId === TaskStatus.IN_PROGRESS) {
            sourceList = inProgressTasks;
            setSourceList = setInProgressTasks;
        } else if (source.droppableId === TaskStatus.DONE) {
            sourceList = doneTasks;
            setSourceList = setDoneTasks;
        }

        if (destination.droppableId === TaskStatus.TODO) {
            setDestList = setToDoTasks;
        } else if (destination.droppableId === TaskStatus.IN_PROGRESS) {
            setDestList = setInProgressTasks;
        } else if (destination.droppableId === TaskStatus.DONE) {
            setDestList = setDoneTasks;
        }

        draggedTask = sourceList.find(task => task.id === draggableId);
        if (!draggedTask) return;

        // Remove from source and add to destination
        setSourceList(prev => prev.filter(task => task.id !== draggableId));
        setDestList(prev => [
            ...prev.slice(0, destination.index),
            { ...draggedTask, status: destination.droppableId as TaskStatus },
            ...prev.slice(destination.index)
        ]);

        // Update on server
        if (!user) return;
        axios.post(`http://localhost:3000/updatetask/${draggableId}`, {
            title: draggedTask.title,
            description: draggedTask.description,
            status: destination.droppableId,
            userEmail: user.email
        }).then(() => {
            // Optionally re-fetch tasks here if you want to stay in sync
        });
    };

    // Update all lists after edit/delete
    const handleTaskUpdate = () => {
        if (!user) return;
        axios.get('http://localhost:3000/tasks', {
            params: { userEmail: user.email }
        })
        .then((response) => {
            setToDoTasks(response.data.ToDoTasks || []);
            setInProgressTasks(response.data.InProgressTasks || []);
            setDoneTasks(response.data.DoneTasks || []);
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    };

    if (!user) {
        console.error("User context is not available");
        return <UserNeeded />;
    }

    const columns = [
        {
            id: TaskStatus.TODO,
            name: "To Do",
            tasks: toDoTasks,
        },
        {
            id: TaskStatus.IN_PROGRESS,
            name: "In Progress",
            tasks: inProgressTasks,
        },
        {
            id: TaskStatus.DONE,
            name: "Done",
            tasks: doneTasks,
        },
    ];

    return (
        <div className="w-100">
            {/* Button to open Image Carousel */}
            {hobby && (
                <div className="d-flex justify-content-center my-3">
                    <button
                        className="btn btn-outline-primary"
                        style={{ background: "var(--palette-1)", color: "var(--palette-4)", borderColor: "var(--palette-4)" }}
                        onClick={() => setShowCarousel(true)}
                    >
                        Show {hobby.name} Inspiration Images
                    </button>
                </div>
            )}
            {/* Image Carousel Modal */}
            {showCarousel && hobby && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.35)",
                        zIndex: 3000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => setShowCarousel(false)}
                >
                    <div
                        style={{ position: "relative", width: "100vw", maxWidth: "100vw" }}
                        onClick={e => e.stopPropagation()}
                        className="full-width-page"
                    >
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 32,
                                zIndex: 10,
                                filter: "invert(0.5)",
                                opacity: 0.7,
                            }}
                            onClick={() => setShowCarousel(false)}
                        />
                        <ImageCarousel hobby={hobby.name} onClose={() => setShowCarousel(false)} />
                    </div>
                </div>
            )}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="columns row">
                    {columns.map(col => (
                        <ProgressColumn
                            id={col.id}
                            name={col.name}
                            tasks={col.tasks}
                            key={col.id}
                            colClass="col-12 col-md-4"
                            onUpdateTask={handleTaskUpdate}
                            hobby={hobby.name} // Pass hobby to ProgressColumn
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
export default TaskChart;