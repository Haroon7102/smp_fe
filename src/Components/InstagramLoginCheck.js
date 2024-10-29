import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Dashboard() {
    const [loginStatus, setLoginStatus] = useState(null);
    const [pages, setPages] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // Check login status from URL query
        const query = new URLSearchParams(location.search);
        const loggedIn = query.get("logged_in");

        setLoginStatus(loggedIn === "true");

        if (loggedIn === "true") {
            // Fetch Instagram pages if logged in successfully
            fetchPages();
        }
    }, [location.search]);

    const fetchPages = async () => {
        try {
            const response = await axios.get('/api/instagram/pages'); // Adjust to match your backend route
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

    const handlePost = async (pageId, caption) => {
        try {
            await axios.post('/api/instagram/post', { pageId, caption });
            console.log("Post successful!");
        } catch (error) {
            console.error('Error posting to Instagram:', error);
        }
    };

    return (
        <div>
            {loginStatus === null ? (
                <p>Loading...</p>
            ) : loginStatus ? (
                <div>
                    <h1>Connected to Instagram</h1>
                    <p>Select a page, write a caption, and post:</p>

                    {pages.length > 0 ? (
                        <div>
                            {pages.map((page) => (
                                <div key={page.id}>
                                    <h2>{page.name}</h2>
                                    <input
                                        type="text"
                                        placeholder="Write a caption"
                                        onBlur={(e) => handlePost(page.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No pages found.</p>
                    )}
                </div>
            ) : (
                <p>Failed to connect to Instagram. Please try logging in again.</p>
            )}
        </div>
    );
}

export default Dashboard;
