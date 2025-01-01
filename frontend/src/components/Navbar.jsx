import React from 'react';
import './Navbar.css';
import { FaSignOutAlt } from 'react-icons/fa'; // Import exit icon from React Icons
import { useNavigate } from 'react-router-dom'; // For navigation

const Navbar = ({ toggleLanguage, language, fullname, onArchiveTask, onShowArchivedTasks }) => {
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
      if( window.confirm("Are you sure you want to exit?")){
        localStorage.removeItem('jwtToken'); // Remove the JWT token
        navigate('/login');
      }
     
         // Redirect to the login page
    };

    const handleArchiveTask = () => {
        onArchiveTask();
    };

    const handleShowArchivedTasks = () => {
        onShowArchivedTasks();
    };

    return (
        <nav className="navbar">
            <div className='navbar-left'>
                <p>Welcome: <span className='navbar-name'>{fullname}</span></p>
            </div>
            <div className="navbar-header">
                <div className="navbar-logo">
                    <img src="/logo.jpg" alt="App Logo" className="app-logo" />
                </div>
                <div className="navbar-title">Task Manager</div>
            </div>
            <div className="navbar-links">
                <button onClick={handleArchiveTask}>
                    {language === 'en' ? 'Archive Task' : 'Arkivo Detyrat'}
                </button>
                <button onClick={handleShowArchivedTasks}>
                    {language === 'en' ? 'Show Archives' : 'Shfaq Arkivat'}
                </button>
                <button onClick={toggleLanguage}>
                    {language === 'en' ? 'AL' : 'EN'}
                </button>
                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt /> {/* Exit icon */}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;