import React from 'react';
import './MainDashboard.css';

const MainDashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Dashboard Overview</h1>

            <div className="dashboard-metrics">
                <div className="metric-card">
                    <h2>Total Posts</h2>
                    <p>120</p>
                </div>
                <div className="metric-card">
                    <h2>Scheduled Posts</h2>
                    <p>15</p>
                </div>
                <div className="metric-card">
                    <h2>Posted Content</h2>
                    <p>105</p>
                </div>
                <div className="metric-card">
                    <h2>Total Likes</h2>
                    <p>2,340</p>
                </div>
            </div>

            <div className="analytics-overview">
                <h2>Analytics Overview</h2>
                <p>Top-performing posts, recent activity, and engagement trends will be displayed here.</p>
            </div>

            <div className="sidebar">
                <h3>Navigation Menu</h3>
                <ul>
                    <li>Create New Post</li>
                    <li>Account Settings</li>
                    <li>View Detailed Analytics</li>
                </ul>
            </div>
        </div>
    );
};

export default MainDashboard;
