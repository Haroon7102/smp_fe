import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for React Router v6
import { Link } from 'react-router-dom';

import './Dashboard.css';
import FacebookLoginCheck from './FacebookLoginCheck';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleShowPostsClick = () => {
        if (userInfo) {
            // Navigate to /posts page and pass email as state
            navigate('/posts', { state: { email: userInfo.email } });
        }
    };
    const handleScheduledPostsClick = () => {
        if (userInfo) {
            navigate('/sch-posts', { state: { email: userInfo.email } }); // Passing email as state
        }
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
                        <p>{userInfo.name}</p>
                        <p>{userInfo.email}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                <hr />
                <Link to="/settings" className="sidebar-link">
                    <button className="sidebar-btn">Settings</button>
                </Link>

                {/* Use handleShowPostsClick to navigate to /posts page */}
                <button onClick={handleShowPostsClick} className="sidebar-btn">
                    Total Posts
                </button>

                <button onClick={handleScheduledPostsClick} className="sidebar-btn">
                    Scheduled Posts
                </button>

                <Link to="/chatbot" className="sidebar-link">
                    <button className="sidebar-btn">
                        Chatbot
                    </button>
                </Link>
            </div>
            <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <h2>Welcome to your Dashboard</h2>

                {/* Pass the email to FacebookLoginCheck */}
                {userInfo && <FacebookLoginCheck email={userInfo.email} />}
            </div>
        </div>
    );
};

export default Dashboard;






// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './Dashboard.css';
// import FacebookLoginCheck from './FacebookLoginCheck';
// import InstagramLoginCheck from './InstagramLoginCheck';

// const Dashboard = () => {
//     const [isSidebarOpen, setSidebarOpen] = useState(false);
//     const [userInfo, setUserInfo] = useState(null);

//     const toggleSidebar = () => {
//         setSidebarOpen(!isSidebarOpen);
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await fetch('https://smp-be-mysql.vercel.app/auth/user', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log('User data:', data); // Verify data structure here
//                     setUserInfo(data);
//                 } else {
//                     console.error('Failed to fetch user data:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };

//         fetchUserData();
//     }, []);

//     return (
//         <div className="dashboard">
//             <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
//                 <div className="menu-icon" onClick={toggleSidebar}>
//                     &#9776;
//                 </div>
//                 <h3>Personal Info</h3>
//                 {userInfo ? (
//                     <>
//                         <p>{userInfo?.name || 'No name provided'}</p>
//                         <p>{userInfo?.email || 'No email provided'}</p>
//                     </>
//                 ) : (
//                     <p>Loading...</p>
//                 )}
//                 <hr />
//                 <Link to="/settings" className="sidebar-link">
//                     <button className="sidebar-btn">Settings</button>
//                 </Link>
//             </div>
//             <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
//                 <h2>Welcome to your Dashboard</h2>

//                 <FacebookLoginCheck />
//                 <InstagramLoginCheck />
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
