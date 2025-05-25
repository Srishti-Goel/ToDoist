import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SideNavBarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    // Collapse navbar on route change
    useEffect(() => {
        setCollapsed(true);
    }, [location]);

    return (
        <div
            className={`d-flex flex-column flex-shrink-0 position-fixed top-0 start-0 h-100 ${collapsed ? 'bg-transparent' : ''} p-3`}
            style={{
                width: collapsed ? '80px' : '220px',
                backgroundColor: collapsed
                    ? 'transparent'
                    : 'var(--palette-5)',
                transition: 'width 0.3s, background-color 0.3s',
                color: collapsed ? 'transparent' : "var(--palette-6)"
            }}
        >
            <button
                className="btn btn-outline-secondary mb-3 mt-2 align-self-end"
                style={{
                    width: '40px',
                    marginRight: collapsed ? '10px' : '0',
                    color: !collapsed ? '#fff' : undefined,
                    borderColor: 'transparent',
                    background: 'transparent'
                }}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <span>&#9776;</span> : <span>&#10005;</span>}
            </button>
            <a
                href="/#"
                className={`d-flex text-reset align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none ${collapsed ? 'justify-content-center' : ''}`}
            >
                {!collapsed && <span className="fs-4 p-3" >MyApp</span>}
            </a>
            {!collapsed && <hr />}
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className={`text-reset nav-link ${collapsed ? 'text-center p-2' : ''}`}>
                        {!collapsed && <span role="img" aria-label="Features">✨</span>}
                        {!collapsed && <span className="ms-2">Features</span>}
                    </a>
                </li>
            </ul>
            <hr />
        </div>
    );
};

export default SideNavBar;