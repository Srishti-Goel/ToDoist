import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskProgressColumn from "./TaskProgressColumns";
import { DragDropContext } from "@hello-pangea/dnd";
import { useUser } from '../UserContext';
import axios from "axios";
import { FaPlus } from "react-icons/fa";

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

function DragAndDrop() {
    const [toDoTasks, setToDoTasks] = React.useState<Task[]>([]);
    const [inProgressTasks, setInProgressTasks] = React.useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);
    const { user } = useUser();

    // Fetch tasks for the user
    useEffect(() => {
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
    }, [user]);

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

    // Add a new task to "To Do"
    const addTask = () => {
        if (!user) {
            console.warn("User not logged in, tasks will not be saved.");
            return;
        }
        const newTask = {
            title: "New Task",
            description: "New task description",
            status: TaskStatus.TODO,
            userEmail: user.email
        };
        axios.post('http://localhost:3000/tasks', newTask)
            .then(() => {
                // Re-fetch tasks to update UI
                return axios.get('http://localhost:3000/tasks', {
                    params: { userEmail: user.email }
                });
            })
            .then((response) => {
                setToDoTasks(response.data.ToDoTasks || []);
                setInProgressTasks(response.data.InProgressTasks || []);
                setDoneTasks(response.data.DoneTasks || []);
            })
            .catch((error) => {
                console.error("Error creating task:", error);
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

    return (
        <div className="w-100">
            <hr />
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="columns row">
                    <TaskProgressColumn
                        id={TaskStatus.TODO}
                        name="To Do"
                        tasks={toDoTasks}
                        key={TaskStatus.TODO}
                        colClass="col-12 col-md-4"
                        onUpdateTask={handleTaskUpdate}
                    />
                    <TaskProgressColumn
                        id={TaskStatus.IN_PROGRESS}
                        name="In Progress"
                        tasks={inProgressTasks}
                        key={TaskStatus.IN_PROGRESS}
                        colClass="col-12 col-md-4"
                        onUpdateTask={handleTaskUpdate}
                    />
                    <TaskProgressColumn
                        id={TaskStatus.DONE}
                        name="Done"
                        tasks={doneTasks}
                        key={TaskStatus.DONE}
                        colClass="col-12 col-md-4"
                        onUpdateTask={handleTaskUpdate}
                    />
                </div>
            </DragDropContext>
            <button
                className="btn btn-primary mt-3"
                onClick={addTask}
            >
                <FaPlus className="me-2" />
                Create Task
            </button>
        </div>
    );
}
export default DragAndDrop;