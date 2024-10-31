import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import FacebookLoginCheck from './FacebookLoginCheck';
import InstagramLoginCheck from './InstagramLoginCheck';

// import CaptionGenerator from './CaptionGenerator';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        // Fetch user information from your API
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('User data:', data); // Add this line
                    setUserInfo(data);
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="dashboard">
            <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="menu-icon" onClick={toggleSidebar}>
                    &#9776; {/* 3-line menu icon */}
                </div>
                <h3>Personal Info</h3>
                {userInfo ? (
                    <>
                        <p>      {userInfo.name}</p>
                        <p>        {userInfo.email}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                <hr />
                <Link to="/settings" className="sidebar-link">
                    <button className="sidebar-btn">Settings</button>
                </Link>
            </div>
            <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h2>Welcome to your Dashboard</h2>

                {/* Other dashboard content */}
                <FacebookLoginCheck />
                {/* <CaptionGenerator /> */}
                <InstagramLoginCheck />

            </div>
        </div>
    );
};

export default Dashboard;
