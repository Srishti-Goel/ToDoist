import React from "react";

interface Hobby {
  name: string;
  color: string;
  inspirationImages: string[];
  mainImage: string;
}

interface SingleSVGProps {
  hobby: Hobby;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, hobby: Hobby) => void;
  draggable?: boolean;
}

const SingleSVG: React.FC<SingleSVGProps> = ({
  hobby,
  onDragStart,
  draggable = true,
}) => {
  return (
    <div
      draggable={draggable}
      onDragStart={e => onDragStart && onDragStart(e, hobby)}
      style={{
        display: "inline-block",
        cursor: "grab",
        userSelect: "none",
        padding: 12,
        borderRadius: 12,
        background: "var(--palette-1)",
        border: `2px solid ${hobby.color}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        minWidth: 120,
        textAlign: "center",
        margin: 8,
      }}
      title={hobby.name}
    >
      {/* SVG or Image */}
      <div style={{ marginBottom: 8 }}>
        <img
          src={hobby.mainImage}
          alt={hobby.name}
          style={{
            width: 64,
            height: 64,
            objectFit: "cover",
            borderRadius: "50%",
            border: `2px solid ${hobby.color}`,
            background: "#fff",
          }}
        />
      </div>
      <div style={{ fontWeight: 600, color: hobby.color, fontSize: "1.1rem" }}>
        {hobby.name}
      </div>
      {/* Inspiration images preview (optional) */}
      {hobby.inspirationImages && hobby.inspirationImages.length > 0 && (
        <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 4 }}>
          {hobby.inspirationImages.slice(0, 3).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Inspiration"
              style={{
                width: 22,
                height: 22,
                objectFit: "cover",
                borderRadius: "4px",
                border: `1px solid ${hobby.color}`,
                background: "#fff",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSVG;