import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    FaHome, FaCog, FaQuestion, FaSignOutAlt, FaSignInAlt, FaUserPlus,
    FaBars, FaTimes,
    FaUser
} from 'react-icons/fa';
import { useUser } from './UserContext';

interface SideNavBarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}



const SideNavBar: React.FC<SideNavBarProps> = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const { user, setUser } = useUser();

    // List of elements in the upper part of the sidebar
    const upperBar = [
        { name: 'Home', icon: <FaHome size={28}/>, link: '/' },
    ];

    const sideBarList = (fields: { name: string; icon: JSX.Element; link: string }[]) => (
        fields.map((item, index) => (
            <Link
                key={index}
                to={item.link}
                className={`nav-link text-reset d-flex align-items-center mb-3 ${collapsed ? 'justify-content-center' : ''}`}
                onClick={() => setCollapsed(true)}
                style={{ textDecoration: 'none' }}
            >
                {!collapsed && <span className="fs-4" style={{ color: 'var(--palette-1)', opacity: '100%' }}>{item.icon}</span>}
                {!collapsed && <span className="ms-2" style={{ color: 'var(--palette-1)' }}>{item.name}</span>}
            </Link>
        ))
    );

    // List of elements in the lower part of the sidebar
    const lowerBar = [
        { name: 'Profile', icon: <FaUser size={28} />, link: '/profile' },
        // { name: 'Help', icon: <FaQuestion size={28} />, link: '/help' },
        {name: 'Logout', icon: <FaSignOutAlt size={28} />, link: '/logout' },
        {name: 'Log-In', icon: <FaSignInAlt size={28} />, link: '/login'},
        {name: 'Sign-Up', icon: <FaUserPlus size={28} />, link: '/signup'},
    ];

    console.log("User:", user);

    if (user) {
        lowerBar.splice(3, 2); // Remove Log-In and Sign-Up if user is logged in
    } else {
        lowerBar.splice(2, 1); // Remove Logout if user is not logged in
    }

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
                color: collapsed ? 'transparent' : "var(--palette-6)",
                opacity:'80%'
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
                {collapsed ? <span style={{fontSize:'20pt'}}>&#9776;</span> : <span style={{fontSize:'20pt'}}>&#10005;</span>}
            </button>

            {sideBarList(upperBar)}
            {!collapsed && <hr style={{color: 'var(--palette-1)', borderWidth: '5pt'}}/>}
            {sideBarList(lowerBar)}
        </div>
    );
};

export default SideNavBar;