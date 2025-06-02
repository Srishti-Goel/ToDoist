import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface TopNavBarProps {
    collapsed: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ collapsed }) => {
    // Adjust these values to match your SideNavBar widths
    const sideNavWidth = collapsed ? 60 : 220;
    const navigate = useNavigate();

    return (
        <nav
            style={{
                width: "100%",
                background: 'var(--palette-5)',
                padding: "1rem 2rem", // Increased vertical padding for more height
                minHeight: "72px",      // Ensures a minimum height for the nav
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                transition: "margin-left 0.2s"
            }}
            className="full-width-page"
        >
            <button
                onClick={() => navigate("/")}
                style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    marginLeft: collapsed ? 50 : sideNavWidth,
                    cursor: "pointer",
                    padding: 0
                }}
            >
                MyApp
            </button>
            <ul style={{
                listStyle: "none",
                display: "flex",
                gap: "1.5rem",
                margin: 0,
                padding: 0
            }}>
                {/* <li>
                    <button
                        style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, font: "inherit" }}
                        onClick={() => navigate("/about")}
                    >
                        About
                    </button>
                </li>
                <li>
                    <button
                        style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, font: "inherit" }}
                        onClick={() => navigate("/contact")}
                    >
                        Contact
                    </button>
                </li> */}
                <li>
                    <button
                        style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, font: "inherit" }}
                        onClick={() => navigate("/profile")}
                    >
                        <FaUser size={28} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default TopNavBar;