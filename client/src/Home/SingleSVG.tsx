import React from "react";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import axios from "axios";
import { useUser } from "../UserContext";
import Task from "../TaskChart/Task";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Hobby {
  name: string;
  color: string;
  inspirationImages: string[];
  mainImage: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
}

interface SingleSVGProps {
  hobby: Hobby;
  draggable?: boolean;
}

const SingleSVG: React.FC<SingleSVGProps> = ({
  hobby,
  draggable = true,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showTasks, setShowTasks] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = React.useState(false);

  const handleDoubleClick = () => {
    setShowDetails((v) => !v);
    setShowTasks(false);
  };

  const {user} = useUser();

  const handleShowTasks = async () => {
    setLoadingTasks(true);
    setShowTasks(true);
    try {
      const res = await axios.get("http://localhost:3000/tasks", {
        params: { userEmail: user?.email, hobby: hobby.name }
      });
      // Adjust according to your backend response structure
      const allTasks: Task[] = [
        ...(res.data.ToDoTasks || []),
        ...(res.data.InProgressTasks || []),
        ...(res.data.DoneTasks || [])
      ];
      setTasks(allTasks);
    } catch (err) {
      setTasks([]);
    }
    setLoadingTasks(false);
  };

  const details = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
      onClick={handleDoubleClick}
      >
    <div
      style={{
        minWidth: 260,
        maxWidth: 420,
        margin: "auto",
        padding: "32px 24px 24px 24px",
        borderRadius: 18,
        background: hobby.color + "55", // Increased opacity (hex alpha 55 ≈ 33%)
        color: hobby.color,
        fontWeight: 600,
        fontSize: "1.1rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        textAlign: "center",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      className="full-width-page"
      onClick={e => e.stopPropagation()}
    >
      {/* Close button in top right */}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        style={{
        position: "absolute",
        top: 16,
        right: 16,
        filter: "invert(0.5)",
        opacity: 0.7,
        zIndex: 10,
        }}
        onClick={handleDoubleClick}
      />
      {/* Hobby image */}
      <div style={{ marginBottom: 12 }}>
      </div>
      {/* Hobby name */}
      <div style={{
        fontSize: "1.35rem",
        fontWeight: 700,
        marginBottom: 8,
        color: hobby.color,
        letterSpacing: 1,
      }}>
        {hobby.name}
      </div>
      {/* Toggle buttons */}
      <div className="my-3 d-flex justify-content-center gap-2">
        <button
        className={`btn btn-outline-${!showTasks ? "primary" : "secondary"} btn-sm`}
        style={{
          color: !showTasks ? "#fff" : hobby.color,
          background: !showTasks ? hobby.color : "#fff",
          borderColor: hobby.color,
          fontWeight: 600,
          minWidth: 100,
          transition: "all 0.15s",
        }}
        onClick={() => setShowTasks(false)}
        disabled={!showTasks}
        >
        Show Images
        </button>
        <button
        className={`btn btn-outline-${showTasks ? "primary" : "secondary"} btn-sm`}
        style={{
          color: showTasks ? "#fff" : hobby.color,
          background: showTasks ? hobby.color : "#fff",
          borderColor: hobby.color,
          fontWeight: 600,
          minWidth: 100,
          transition: "all 0.15s",
        }}
        onClick={handleShowTasks}
        disabled={showTasks}
        >
        Show Tasks
        </button>
      </div>
      {/* Content */}
      <div style={{ minHeight: 120 }}>
        {!showTasks ? (
        <ImageCarousel hobby={hobby.name} onClose={handleDoubleClick} />
        ) : loadingTasks ? (
        <div className="text-muted py-3">Loading tasks...</div>
        ) : tasks.length === 0 ? (
        <div className="text-secondary py-3">No tasks found for this hobby.</div>
        ) : (
        <ul className="list-group" style={{ background: "transparent" }}>
          {tasks.map((task) => (
            <li
            key={task.id}
            className="list-group-item"
            style={{
              background: "#f8f9fa",
              color: hobby.color,
              fontWeight: 500,
              marginBottom: 6,
              border: `1px solid ${hobby.color}33`,
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              textAlign: "left",
            }}
            >
            <div style={{ fontWeight: 700 }}>{task.title}</div>
            <div style={{ fontSize: "0.98em", color: "#444" }}>{task.description}</div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
    </div>
  );

  console.log(hobby.mainImage);

  return (
    <div
      draggable={draggable}
      style={{
        display: "inline-block",
        cursor: "pointer",
        userSelect: "none",
        padding: showDetails ? 12 : 0,
        borderRadius: 12,
        background: "transparent",
        minWidth: 64,
        textAlign: "center",
        margin: 8,
        animationName: "animation_6_1",
        animationDuration: "2s",
        animationDelay: "0s",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
      title={hobby?.name || "Untitled Hobby"}
      onDoubleClick={handleDoubleClick}
      className=""
    >
      <img
        src={hobby.mainImage || ""}
        alt={hobby.name}
        style={{
          width: 64,
          height: 64,
          objectFit: "cover",
          minWidth: "200px",
          minHeight: "200px",
        }}
      />
      {showDetails && details}
    </div>
  );
};

export default SingleSVG;