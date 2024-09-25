import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="PostScheduler.js">Schedule Post</a></li>
                <li><a href="#history">Post History</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
