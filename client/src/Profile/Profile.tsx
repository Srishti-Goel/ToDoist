import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import UserNeeded from "../UserNeeded";
import { FaUserCircle, FaPlus } from "react-icons/fa";

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

    useEffect(() => {
        if (user?.email) {
            axios.get(serverUrl+'/hobbies/names', { params: { userEmail: user.email } })
                .then(res => setHobbies(res.data))
                .catch(() => setHobbies([]))
                .finally(() => setLoading(false));
        } else {
            setHobbies([]);
            setLoading(false);
        }
    }, [user]);

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
            // Refresh hobbies list
            const res = await axios.get(serverUrl+'/hobbies/names', { params: { userEmail: user?.email } });
            setHobbies(res.data);
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
            {showForm && (
                <form onSubmit={handleAddHobby} className="mb-3 p-3 rounded" style={{ background: "var(--palette-1)", border: "1px solid var(--palette-3)" }}>
                    <div className="mb-2">
                        <label className="form-label" style={{ color: "var(--palette-4)" }}>Hobby Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newHobby}
                            onChange={e => setNewHobby(e.target.value)}
                            style={{ color: "var(--palette-4)", background: "var(--palette-1)", borderColor: "var(--palette-3)" }}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label" style={{ color: "var(--palette-4)" }}>Color</label>
                        <input
                            type="color"
                            className="form-control form-control-color"
                            value={newColor}
                            onChange={e => setNewColor(e.target.value)}
                            title="Choose your color"
                            style={{ width: 50, height: 34, padding: 0, border: "none", background: "transparent" }}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label" style={{ color: "var(--palette-4)" }}>Main Image URL</label>
                        <input
                            type="url"
                            className="form-control"
                            value={mainImage}
                            onChange={e => setMainImage(e.target.value)}
                            style={{ color: "var(--palette-4)", background: "var(--palette-1)", borderColor: "var(--palette-3)" }}
                            required
                        />
                    </div>
                    {formError && <div className="text-danger mb-2">{formError}</div>}
                    <button
                        type="submit"
                        className="btn btn-sm"
                        style={{ background: "var(--palette-4)", color: "var(--palette-1)" }}
                        disabled={adding}
                    >
                        {adding ? "Adding..." : "Add Hobby"}
                    </button>
                </form>
            )}
            {loading ? (
                <div>Loading hobbies...</div>
            ) : hobbies.length === 0 ? (
                <div className="text-muted" style={{ color: "var(--palette-4)" }}>No hobbies found.</div>
            ) : (
                <ul className="list-group">
                    {hobbies.map((hobby, idx) => (
                        <li
                            className="list-group-item d-flex align-items-center"
                            key={idx}
                            style={{
                                color: "var(--palette-4)",
                                background: "var(--palette-1)",
                                border: "1px solid var(--palette-3)",
                                fontWeight: 500,
                                fontSize: "1.05rem"
                            }}
                        >
                            <span style={{
                                display: "inline-block",
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "var(--palette-4)",
                                marginRight: 12
                            }}></span>
                            {hobby}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Profile;