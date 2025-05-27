import React from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserNeeded: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div
            style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--palette-4)'
            }}
        >
            <h2>Login Required</h2>
            <p>You must be logged in to view this page.</p>
            <button
                onClick={handleLogin}
                style={{
                    padding: '0.5rem 1.5rem',
                    marginTop: '1rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: 'var(--palette-1)',
                    border: '1px solid var(--palette-4)',
                    background: 'var(--palette-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
                className='btn btn-primary'
            >
                <FaSignInAlt size={18} />
                Go to Login
            </button>
        </div>
    );
};

export default UserNeeded;