import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SideNavBarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    // List of elements in the upper part of the sidebar
    const upperBar = [
        { name: 'Home', icon: '🏠', link: '/' },
    ];

    // List of elements in the lower part of the sidebar
    const lowerBar = [
        { name: 'Settings', icon: '⚙️', link: '/settings' },
        { name: 'Help', icon: '❓', link: '/help' },
        {name: 'Logout', icon: '🚪', link: '/logout' },
        {name: 'Sign-Up', icon: '📝', link: '/signup'},
        {name: 'Log-In', icon: '🔑', link: '/login'}
    ];

    // Collapse navbar on route change
    useEffect(() => {
        setCollapsed(true);
    }, [location]);

    // Handle click outside to collapse the navbar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.sidebar') && !target.closest('.btn')) {
                setCollapsed(true);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [setCollapsed]);



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

            {upperBar.map((item, index) => (
                <a
                    key={index}
                    href={item.link}
                    className={`nav-link text-reset d-flex align-items-center mb-3 ${collapsed ? 'justify-content-center' : ''}`}
                >
                    <span className="fs-4">{item.icon}</span>
                    {!collapsed && <span className="ms-2">{item.name}</span>}
                </a>
            ))}
            {!collapsed && <hr />}
            {lowerBar.map((item, index) => (
                <a
                    key={index}
                    href={item.link}
                    className={`nav-link text-reset d-flex align-items-center mb-3 ${collapsed ? 'justify-content-center' : ''}`}
                >
                    <span className="fs-4">{item.icon}</span>
                    {!collapsed && <span className="ms-2">{item.name}</span>}
                </a>
            ))}
        </div>
    );
};

export default SideNavBar;