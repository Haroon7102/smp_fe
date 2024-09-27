import React, { useEffect, useState, useCallback } from 'react';
import './FacebookLoginCheck.css'; // Import CSS styles

const FacebookLoginCheck = () => {
    const [loginStatus, setLoginStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);
    const [postEngagements, setPostEngagements] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [postMessage, setPostMessage] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [likes, setLikes] = useState([]);

    // Memoize fetchUserPages using useCallback
    const fetchUserPages = useCallback(() => {
        const accessToken = localStorage.getItem('facebookAccessToken');
        if (accessToken) {
            window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
                if (response && !response.error) {
                    setPages(response.data);
                }
            });
        }
    }, []);

    // Memoize statusChangeCallback and include fetchUserPages as a dependency
    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            localStorage.setItem('facebookAccessToken', response.authResponse.accessToken);
            setLoginStatus('connected');
            fetchUserPages();
        } else if (response.status === 'not_authorized') {
            setLoginStatus('not_authorized');
        } else {
            setLoginStatus('not_logged_in');
        }
        setLoading(false);
    }, [fetchUserPages]);

    const handlePostOnFacebook = async () => {
        if (!selectedPage) {
            console.error('No page selected.');
            return;
        }

        const accessToken = localStorage.getItem('facebookAccessToken');
        const formData = new FormData();
        formData.append('message', postMessage);
        if (postImage) {
            formData.append('source', postImage);
        }

        try {
            const response = await fetch(
                `https://graph.facebook.com/${selectedPage.id}/photos?access_token=${accessToken}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const result = await response.json();
            if (result.id) {
                fetchPostEngagement(result.id);
            }
        } catch (error) {
            console.error('Error posting on Facebook:', error);
        }
    };

    const fetchPostEngagement = useCallback((postId) => {
        // Simulate engagement with mock data until permission is granted
        const mockComments = [
            { user: 'John Doe', message: 'Great post!' },
            { user: 'Jane Smith', message: 'I love this content!' },
            { user: 'Alex Johnson', message: 'Keep it up!' }
        ];

        const mockLikes = [
            { user: 'John Doe' },
            { user: 'Jane Smith' },
            { user: 'Alex Johnson' }
        ];

        setPostEngagements(mockComments);
        setLikes(mockLikes);

        // Uncomment below code to fetch real engagement once permissions are granted
        /*
        window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, (response) => {
            if (response && !response.error) {
                setPostEngagements(response.data);
            }
        });
        window.FB.api(`/${postId}/likes`, 'GET', { access_token: accessToken }, (response) => {
            if (response && !response.error) {
                setLikes(response.data);
            }
        });
        */
    }, []);

    const handleLogout = useCallback(() => {
        window.FB.logout((response) => {
            console.log('Logged out from Facebook:', response);
            setLoginStatus('not_logged_in');
            localStorage.removeItem('facebookAccessToken');
            setPages([]);
            setSelectedPage(null);
            setPostMessage('');
            setPostImage(null);
            setPostEngagements([]);
            setLikes([]);
        });
    }, []);

    useEffect(() => {
        const loadFacebookSDK = () => {
            if (window.FB) {
                window.FB.getLoginStatus((response) => {
                    statusChangeCallback(response);
                });
            } else {
                const script = document.createElement('script');
                script.src = "https://connect.facebook.net/en_US/sdk.js";
                script.async = true;
                script.onload = () => {
                    window.FB.init({
                        appId: '1332019044439778',
                        cookie: true,
                        xfbml: true,
                        version: 'v17.0',
                    });
                    window.FB.getLoginStatus((response) => {
                        statusChangeCallback(response);
                    });
                };
                document.body.appendChild(script);
            }
        };

        loadFacebookSDK();
    }, [statusChangeCallback]);

    const handleLogin = () => {
        window.FB.login((response) => {
            statusChangeCallback(response);
        }, { scope: 'pages_manage_posts,pages_read_engagement,pages_show_list' });
    };

    return (
        <div className="facebook-container">
            <h2>Facebook Integration</h2>
            {loading ? (
                <p>Loading...</p>
            ) : loginStatus === 'connected' ? (
                <div>
                    <p>Logged in with Facebook.</p>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="logout-button">Log Out</button>

                    {/* Select Page */}
                    {pages.length > 0 && (
                        <div className="page-list">
                            <h3>Select a Page</h3>
                            {pages.map((page) => (
                                <button key={page.id} onClick={() => setSelectedPage(page)}>
                                    {page.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Post Input */}
                    {selectedPage && (
                        <div className="post-section">
                            <p>Selected Page: {selectedPage.name}</p>
                            <textarea
                                placeholder="Write your post..."
                                value={postMessage}
                                onChange={(e) => setPostMessage(e.target.value)}
                            ></textarea>
                            <input
                                type="file"
                                onChange={(e) => setPostImage(e.target.files[0])}
                            />
                            <button onClick={handlePostOnFacebook}>Post on Facebook</button>
                        </div>
                    )}

                    {/* Post Engagements */}
                    {postEngagements.length > 0 && (
                        <div className="engagement-section">
                            <h3>Comments</h3>
                            {postEngagements.map((comment, index) => (
                                <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
                            ))}
                        </div>
                    )}
                    <a href="https://example.com" target="_blank" rel="noreferrer">Example Link</a>


                    {/* Post Likes */}
                    {likes.length > 0 && (
                        <div className="engagement-section">
                            <h3>Likes</h3>
                            <p>{likes.length} Likes</p>
                        </div>
                    )}
                </div>
            ) : loginStatus === 'not_authorized' ? (
                <p>Logged in with Facebook but not authorized for this app.</p>
            ) : (
                <div>
                    <p>Not logged in with Facebook.</p>
                    <button onClick={handleLogin}>Login with Facebook</button>
                </div>
            )}
        </div>
    );
};

export default FacebookLoginCheck;
