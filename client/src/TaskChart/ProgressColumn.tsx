import Task from "./Task";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Droppable } from "@hello-pangea/dnd";
import { FaPlus } from "react-icons/fa";
import { useUser } from '../UserContext';
import axios from "axios";
import UserNeeded from "../UserNeeded";

interface ProgressColumnProps {
    id: string;
    name: string;
    tasks: any[];
    onUpdateTask?: () => void;
    colClass?: string;
}

function ProgressColumn ({ id, name, tasks, colClass, onUpdateTask }: ProgressColumnProps) {
    const { user } = useUser();

    const addTask = () => {
        if (!user) {
            console.warn("User not logged in, tasks will not be saved.");
            return;
        }
        const newTask = { title: "New Task", description: "New task description", status: id, userEmail: user.email };
        axios.post('http://localhost:3000/tasks', newTask)
            .then(() => {
                if (onUpdateTask) onUpdateTask();
            })
            .catch((error) => {
                console.error("Error updating tasks:", error.response?.data || error);
            });
    }

    if (!user) {
        console.error("User context is not available");
        return <UserNeeded />;
    }
    return (
        <div className={`${colClass ?? "col-12 col-md mb-3"} d-flex flex-column p-3`} style={{ minWidth: 220 }}>
            <Droppable droppableId={id}>
            {(provided) => (
            <div className="card shadow-sm h-100 border-0 rounded-0"
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                <div className="card-header text-white border-0 rounded-0 d-flex justify-content-between align-items-center" style={{ background: "var(--palette-4)" }}>
                    <h4 className="mb-0">{name}</h4>
                    <FaPlus
                        className="text-white ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={addTask}
                        title="Add Task"
                    />
                </div>
                <div className="card-body border-0 rounded-0" style={{ background: "var(--palette-4)", minHeight: "300px" }}>
                    {tasks.length === 0 ? (
                        <div className="text-muted text-center">No tasks</div>
                    ) : (
                        tasks.map((task, index) => (
                            <Task
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            index={index}
                            status={id}
                            onUpdateTask={onUpdateTask}
                            />
                        ))
                    )}
                    {provided.placeholder}
                </div>
            </div>
            )}
            </Droppable>
        </div>
    )
}

export default ProgressColumn;