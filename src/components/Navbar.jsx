import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBlog, FaHome, FaPlusSquare, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem("authData"));

    const handleLogout = () => {
        localStorage.removeItem("authData");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
                    <FaBlog className="logo-icon" />
                    <span className="logo-text">BlogPost</span>
                </div>

                <div className="navbar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FaHome className="nav-icon" /> Home
                    </NavLink>

                    <NavLink to="/create-post" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FaPlusSquare className="nav-icon" /> Create Post
                    </NavLink>
                </div>

                <div className="navbar-actions">
                    <span className="user-name">Hi, {authData?.name?.split(' ')[0] || 'User'}</span>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
