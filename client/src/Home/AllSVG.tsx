import React, { useEffect } from "react";
import SingleSVG from "./SingleSVG";
import { useUser } from "../UserContext";
import axios from "axios";

const hobbies = [
	{
		name: "Work",
		color: "green",
		inspirationImages: [],
		mainImage: "https://www.svgrepo.com/download/7651/laptop.svg",
	},
	{
		name: "Work",
		color: "green",
		inspirationImages: [],
		mainImage: "https://www.svgrepo.com/download/7651/laptop.svg",
	},
	{
		name: "Work",
		color: "green",
		inspirationImages: [],
		mainImage: "https://www.svgrepo.com/download/7651/laptop.svg",
	},
];

const getRandomPosition = () => ({
	x: Math.floor(Math.random() * 400) + 40,
	y: Math.floor(Math.random() * 300) + 40,
});

const AllSVG: React.FC = () => {

    const { user } = useUser();

    
	const [items, setItems] = React.useState(
        hobbies.map((hobby) => ({
            ...hobby,
			position: getRandomPosition(),
		}))
	);
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }
        console.log("Fetching hobbies for user:", user.email);
        axios.get("http://localhost:3000/hobbies", {
            params: { userEmail: user.email },
        })
        .then((res) => {
            const hobbiesWithPosition = res.data.map((hobby: any) => ({
                ...hobby,
                position: getRandomPosition(),
            }));
            setItems(hobbiesWithPosition);
        })
        .catch((err) => {
            console.error("Failed to fetch hobbies:", err);
            setItems([]);
        });
    }, [user]);
	const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
	const svgRefs = React.useRef<(HTMLDivElement | null)[]>([]);

	const handleDragStart = (idx: number) => {
		setDraggedIdx(idx);
	};

	const handleDrag = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
		// Prevent default to allow drop
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
		if (draggedIdx === null) return;
		const boundingRect = e.currentTarget.parentElement?.getBoundingClientRect();
		const x = e.clientX - (boundingRect?.left || 0) - 60;
		const y = e.clientY - (boundingRect?.top || 0) - 60;
		setItems((items) =>
			items.map((item, i) =>
				i === draggedIdx ? { ...item, position: { x, y } } : item
			)
		);
		setDraggedIdx(null);
	};

	const handleContainerDrop = (e: React.DragEvent<HTMLDivElement>) => {
		if (draggedIdx === null) return;
		const boundingRect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - boundingRect.left - 60;
		const y = e.clientY - boundingRect.top - 60;
		setItems((items) =>
			items.map((item, i) =>
				i === draggedIdx ? { ...item, position: { x, y } } : item
			)
		);
		setDraggedIdx(null);
	};

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				background: "transparent", // Keep background transparent
				zIndex: 100,
			}}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleContainerDrop}
		>
			{items.map((hobby, idx) => (
				<div
					key={idx}
					ref={(el) => (svgRefs.current[idx] = el)}
					draggable
					onDragStart={() => handleDragStart(idx)}
					onDrag={(e) => handleDrag(e, idx)}
					onDrop={(e) => handleDrop(e, idx)}
					style={{
						position: "absolute",
						left: hobby.position.x,
						top: hobby.position.y,
						zIndex: draggedIdx === idx ? 10 : 1,
						cursor: "grab",
						opacity: draggedIdx === idx ? 0.7 : 1,
					}}
				>
					<SingleSVG hobby={hobby} draggable={false} />
				</div>
			))}
		</div>
	);
};

export default AllSVG;