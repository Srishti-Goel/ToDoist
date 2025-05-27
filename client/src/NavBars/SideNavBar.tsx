import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    FaHome, FaSignOutAlt, FaSignInAlt,
    FaUserPlus, FaBars, FaUser
} from 'react-icons/fa';
import { useUser } from '../UserContext';
import axios from 'axios';

const serverUrl = 'http://localhost:3000';

interface SideNavBarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const { user } = useUser();
    const [hobbies, setHobbies] = useState<string[]>([]);

    // Fetch hobbies for the user
    useEffect(() => {
        if (user?.email) {
            axios.get(serverUrl + '/hobbies/names', { params: { userEmail: user.email } })
                .then(res => setHobbies(res.data))
                .catch(() => setHobbies([]));
        } else {
            setHobbies([]);
        }
        console.log("Hobbies:", hobbies);
    }, [user]);

    // List of elements in the upper part of the sidebar
    const upperBar = [
        { name: 'Home', icon: <FaHome size={28}/>, link: '/' },
        { name: "Task Chart", icon: <FaBars size={28}/>, link: '/taskChart' },
        ...hobbies.map(hobby => ({
            name: hobby,
            icon: <FaBars size={28}/>,
            link: `/taskChart/${encodeURIComponent(hobby)}`
        }))
    ];

    const sideBarList = (fields: { name: string; icon: any; link: string }[]) => (
        fields.map((item, index) => (
            <Link
                key={index}
                to={item.link}
                className={`nav-link text-reset d-flex align-items-center mb-3 ${collapsed ? 'justify-content-center' : ''}`}
                onClick={() => setCollapsed(true)}
                style={{
                    textDecoration: 'none',
                    paddingLeft: collapsed ? 0 : 16, // Add uniform left padding when expanded
                    paddingRight: collapsed ? 0 : 16, // Optional: add right padding for symmetry
                    color: 'var(--palette-4)',
                }}
            >
                {!collapsed &&
                    <div>
                        <span className="fs-4" style={{ color: 'var(--palette-1)', opacity: '100%' }}>{item.icon}</span>
                        <span className="ms-2" style={{ color: 'var(--palette-1)' }}>{item.name}</span>
                    </div>
                }
            </Link>
        ))
    );

    // List of elements in the lower part of the sidebar
    const lowerBarAll = [
        { name: 'Profile', icon: <FaUser size={28} />, link: '/profile' },
        { name: 'Logout', icon: <FaSignOutAlt size={28} />, link: '/logout' },
        { name: 'Log-In', icon: <FaSignInAlt size={28} />, link: '/login' },
        { name: 'Sign-Up', icon: <FaUserPlus size={28} />, link: '/signup' },
    ];

    // Filter lowerBar based on user state
    const lowerBar = user
        ? lowerBarAll.filter(item => item.name !== 'Log-In' && item.name !== 'Sign-Up')
        : lowerBarAll.filter(item => item.name !== 'Logout' && item.name !== 'Profile');

    console.log("User:", user);

    // Collapse navbar on route change
    useEffect(() => {
        if (user?.email) {
            axios.get(serverUrl + '/hobbies/names', { params: { userEmail: user.email } })
                .then(res => setHobbies(res.data))
                .catch(() => setHobbies([]));
        } else {
            setHobbies([]);
        }
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
            className={`d-flex flex-column flex-shrink-0 position-fixed top-0 start-0 h-100 ${collapsed ? 'bg-transparent' : ''} sidebar`}
            style={{
                width: collapsed ? '50px' : '220px',
                height: '100vh',
                zIndex: 1000,
                backgroundColor: collapsed
                    ? 'transparent'
                    : 'var(--palette-5)',
                transition: 'width 0.3s, background-color 0.3s',
                color: collapsed ? 'transparent' : "var(--palette-6)",
                opacity:'90%'
            }}
        >
            <button
                className="btn btn-outline-secondary mb-3 mt-2 align-self-end"
                style={{
                    width: '40px',
                    marginRight: '0',
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