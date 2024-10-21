// import React, { useEffect, useState, useCallback } from 'react';
// import './FacebookLoginCheck.css'; // Import CSS styles

// const FacebookLoginCheck = () => {
//     const [loginStatus, setLoginStatus] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [pages, setPages] = useState([]);
//     const [postEngagements, setPostEngagements] = useState([]);
//     const [selectedPage, setSelectedPage] = useState(null);
//     const [postMessage, setPostMessage] = useState('');
//     const [postImage, setPostImage] = useState(null);
//     const [likes, setLikes] = useState([]);

//     // Wrap the statusChangeCallback function with useCallback
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             const { accessToken } = response.authResponse;
//             localStorage.setItem('facebookAccessToken', accessToken);
//             setLoginStatus('connected');
//             fetchUserPages();
//         } else if (response.status === 'not_authorized') {
//             setLoginStatus('not_authorized');
//         } else {
//             setLoginStatus('not_logged_in');
//         }
//         setLoading(false);
//     }, []); // No dependencies for this callback

//     const fetchUserPages = () => {
//         const accessToken = localStorage.getItem('facebookAccessToken');
//         if (accessToken) {
//             window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
//                 if (response && !response.error) {
//                     setPages(response.data);
//                 }
//             });
//         }
//     };

//     const handlePostOnFacebook = async () => {
//         if (!selectedPage) {
//             console.error('No page selected.');
//             return;
//         }

//         const accessToken = localStorage.getItem('facebookAccessToken');
//         const formData = new FormData();
//         formData.append('message', postMessage);
//         if (postImage) {
//             formData.append('source', postImage);
//         }

//         try {
//             const response = await fetch(
//                 `https://graph.facebook.com/${selectedPage.id}/photos?access_token=${accessToken}`,
//                 {
//                     method: 'POST',
//                     body: formData,
//                 }
//             );

//             const result = await response.json();
//             if (result.id) {
//                 fetchPostEngagement(result.id);
//             }
//         } catch (error) {
//             console.error('Error posting on Facebook:', error);
//         }
//     };

//     const fetchPostEngagement = (postId) => {
//         // Simulate engagement with mock data until permission is granted
//         const mockComments = [
//             { user: 'John Doe', message: 'Great post!' },
//             { user: 'Jane Smith', message: 'I love this content!' },
//             { user: 'Alex Johnson', message: 'Keep it up!' }
//         ];

//         const mockLikes = [
//             { user: 'John Doe' },
//             { user: 'Jane Smith' },
//             { user: 'Alex Johnson' }
//         ];

//         // Simulating the engagement with mock data
//         setPostEngagements(mockComments);
//         setLikes(mockLikes);

//         // Uncomment below code to fetch real engagement once permissions are granted
//         /*
//         window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, (response) => {
//             if (response && !response.error) {
//                 setPostEngagements(response.data);
//             }
//         });
//         window.FB.api(`/${postId}/likes`, 'GET', { access_token: accessToken }, (response) => {
//             if (response && !response.error) {
//                 setLikes(response.data);
//             }
//         });
//         */
//     };

//     const handleLogout = () => {
//         window.FB.logout((response) => {
//             console.log('Logged out from Facebook:', response);
//             setLoginStatus('not_logged_in');
//             localStorage.removeItem('facebookAccessToken');
//             setPages([]);
//             setSelectedPage(null);
//             setPostMessage('');
//             setPostImage(null);
//             setPostEngagements([]);
//             setLikes([]);
//         });
//     };

//     useEffect(() => {
//         const loadFacebookSDK = () => {
//             if (window.FB) {
//                 window.FB.getLoginStatus((response) => {
//                     statusChangeCallback(response);
//                 });
//             } else {
//                 const script = document.createElement('script');
//                 script.src = "https://connect.facebook.net/en_US/sdk.js";
//                 script.async = true;
//                 script.onload = () => {
//                     window.FB.init({
//                         appId: '1332019044439778',
//                         cookie: true,
//                         xfbml: true,
//                         version: 'v17.0',
//                     });
//                     window.FB.getLoginStatus((response) => {
//                         statusChangeCallback(response);
//                     });
//                 };
//                 document.body.appendChild(script);
//             }
//         };

//         loadFacebookSDK();
//     }, [statusChangeCallback]); // Add statusChangeCallback to the dependency array

//     const handleLogin = () => {
//         window.FB.login((response) => {
//             statusChangeCallback(response);
//         }, {
//             scope: 'email,public_profile,pages_manage_posts,pages_read_engagement,pages_show_list' // Add the necessary scopes here
//         });
//     };

//     return (
//         <div className="facebook-container">
//             <h2>Facebook Integration</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : loginStatus === 'connected' ? (
//                 <div>
//                     <p>Logged in with Facebook.</p>

//                     {/* Logout Button */}
//                     <button onClick={handleLogout} className="logout-button">Log Out</button>

//                     {/* Select Page */}
//                     {pages.length > 0 && (
//                         <div className="page-list">
//                             <h3>Select a Page</h3>
//                             {pages.map((page) => (
//                                 <button key={page.id} onClick={() => setSelectedPage(page)}>
//                                     {page.name}
//                                 </button>
//                             ))}
//                         </div>
//                     )}

//                     {/* Post Input */}
//                     {selectedPage && (
//                         <div className="post-section">
//                             <p>Selected Page: {selectedPage.name}</p>
//                             <textarea
//                                 placeholder="Write your post..."
//                                 value={postMessage}
//                                 onChange={(e) => setPostMessage(e.target.value)}
//                             ></textarea>
//                             <input
//                                 type="file"
//                                 onChange={(e) => setPostImage(e.target.files[0])}
//                             />
//                             <button onClick={handlePostOnFacebook}>Post on Facebook</button>
//                         </div>
//                     )}

//                     {/* Post Engagements */}
//                     {postEngagements.length > 0 && (
//                         <div className="engagement-section">
//                             <h3>Comments</h3>
//                             {postEngagements.map((comment, index) => (
//                                 <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
//                             ))}
//                         </div>
//                     )}

//                     {/* Post Likes */}
//                     {likes.length > 0 && (
//                         <div className="engagement-section">
//                             <h3>Likes</h3>
//                             <p>{likes.length} Likes</p>
//                         </div>
//                     )}
//                 </div>
//             ) : loginStatus === 'not_authorized' ? (
//                 <p>Logged in with Facebook but not authorized for this app.</p>
//             ) : (
//                 <div>
//                     <p>Not logged in with Facebook.</p>
//                     <button onClick={handleLogin}>Login with Facebook</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;




// import React, { useEffect, useState, useCallback } from 'react';
// import './FacebookLoginCheck.css'; // Import CSS styles

// const FacebookLoginCheck = () => {
//     const [loginStatus, setLoginStatus] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [pages, setPages] = useState([]);
//     const [postEngagements, setPostEngagements] = useState([]);
//     const [selectedPage, setSelectedPage] = useState(null);
//     const [postMessage, setPostMessage] = useState('');
//     const [postImage, setPostImage] = useState(null);
//     const [likes, setLikes] = useState([]);

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             const { accessToken } = response.authResponse;
//             localStorage.setItem('facebookAccessToken', accessToken);
//             setLoginStatus('connected');
//             fetchUserPages();
//         } else {
//             setLoginStatus('not_logged_in'); // Set to 'not_logged_in' instead of checking 'not_authorized'
//         }
//         setLoading(false);
//     }, []);

//     const fetchUserPages = () => {
//         const accessToken = localStorage.getItem('facebookAccessToken');
//         if (accessToken) {
//             window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
//                 if (response && !response.error) {
//                     setPages(response.data);
//                 }
//             });
//         }
//     };

//     const handlePostOnFacebook = async () => {
//         if (!selectedPage) {
//             console.error('No page selected.');
//             return;
//         }

//         const accessToken = localStorage.getItem('facebookAccessToken');
//         const formData = new FormData();
//         formData.append('message', postMessage);
//         if (postImage) {
//             formData.append('source', postImage);
//         }

//         try {
//             const response = await fetch(
//                 `https://graph.facebook.com/${selectedPage.id}/photos?access_token=${accessToken}`,
//                 {
//                     method: 'POST',
//                     body: formData,
//                 }
//             );

//             const result = await response.json();
//             if (result.id) {
//                 fetchPostEngagement(result.id);
//             }
//         } catch (error) {
//             console.error('Error posting on Facebook:', error);
//         }
//     };

//     const fetchPostEngagement = (postId) => {
//         // Simulated engagement with mock data until permission is granted
//         const mockComments = [
//             { user: 'John Doe', message: 'Great post!' },
//             { user: 'Jane Smith', message: 'I love this content!' },
//             { user: 'Alex Johnson', message: 'Keep it up!' }
//         ];

//         const mockLikes = [
//             { user: 'John Doe' },
//             { user: 'Jane Smith' },
//             { user: 'Alex Johnson' }
//         ];

//         // Simulating the engagement with mock data
//         setPostEngagements(mockComments);
//         setLikes(mockLikes);
//     };

//     const handleLogout = () => {
//         window.FB.logout((response) => {
//             console.log('Logged out from Facebook:', response);
//             setLoginStatus('not_logged_in');
//             localStorage.removeItem('facebookAccessToken');
//             setPages([]);
//             setSelectedPage(null);
//             setPostMessage('');
//             setPostImage(null);
//             setPostEngagements([]);
//             setLikes([]);
//         });
//     };

//     useEffect(() => {
//         const loadFacebookSDK = () => {
//             if (window.FB) {
//                 window.FB.getLoginStatus((response) => {
//                     statusChangeCallback(response);
//                 });
//             } else {
//                 const script = document.createElement('script');
//                 script.src = "https://connect.facebook.net/en_US/sdk.js";
//                 script.async = true;
//                 script.onload = () => {
//                     window.FB.init({
//                         appId: '1332019044439778',
//                         cookie: true,
//                         xfbml: true,
//                         version: 'v17.0',
//                     });
//                     window.FB.getLoginStatus((response) => {
//                         statusChangeCallback(response);
//                     });
//                 };
//                 document.body.appendChild(script);
//             }
//         };

//         loadFacebookSDK();
//     }, [statusChangeCallback]);

//     const handleLogin = () => {
//         window.FB.login((response) => {
//             statusChangeCallback(response);
//         }, {
//             scope: 'email,public_profile,pages_manage_posts,pages_read_engagement,pages_show_list'
//         });
//     };

//     return (
//         <div className="facebook-container">
//             <h2>Facebook Integration</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div>
//                     {loginStatus === 'connected' ? (
//                         <div>
//                             <p>Logged in with Facebook.</p>

//                             {/* Logout Button */}
//                             <button onClick={handleLogout} className="logout-button">Log Out</button>

//                             {/* Select Page */}
//                             {pages.length > 0 && (
//                                 <div className="page-list">
//                                     <h3>Select a Page</h3>
//                                     {pages.map((page) => (
//                                         <button key={page.id} onClick={() => setSelectedPage(page)}>
//                                             {page.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Post Input */}
//                             {selectedPage && (
//                                 <div className="post-section">
//                                     <p>Selected Page: {selectedPage.name}</p>
//                                     <textarea
//                                         placeholder="Write your post..."
//                                         value={postMessage}
//                                         onChange={(e) => setPostMessage(e.target.value)}
//                                     ></textarea>
//                                     <input
//                                         type="file"
//                                         onChange={(e) => setPostImage(e.target.files[0])}
//                                     />
//                                     <button onClick={handlePostOnFacebook}>Post on Facebook</button>
//                                 </div>
//                             )}

//                             {/* Post Engagements */}
//                             {postEngagements.length > 0 && (
//                                 <div className="engagement-section">
//                                     <h3>Comments</h3>
//                                     {postEngagements.map((comment, index) => (
//                                         <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Post Likes */}
//                             {likes.length > 0 && (
//                                 <div className="engagement-section">
//                                     <h3>Likes</h3>
//                                     <p>{likes.length} Likes</p>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div>
//                             <p>Not logged in with Facebook.</p>
//                             <button onClick={handleLogin}>Login with Facebook</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;










// import React, { useEffect, useState, useCallback } from 'react';
// import './FacebookLoginCheck.css'; // Import CSS styles

// const FacebookLoginCheck = () => {
//     const [loginStatus, setLoginStatus] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [pages, setPages] = useState([]);
//     const [postEngagements, setPostEngagements] = useState([]);
//     const [selectedPage, setSelectedPage] = useState(null);
//     const [postMessage, setPostMessage] = useState('');
//     const [postImage, setPostImage] = useState(null);
//     const [likes, setLikes] = useState([]);

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             const { accessToken } = response.authResponse;
//             localStorage.setItem('facebookAccessToken', accessToken);
//             setLoginStatus('connected');
//             fetchUserPages();
//         } else {
//             setLoginStatus('not_logged_in'); // Set to 'not_logged_in' instead of checking 'not_authorized'
//         }
//         setLoading(false);
//     }, []);

//     const fetchUserPages = () => {
//         const accessToken = localStorage.getItem('facebookAccessToken');
//         if (accessToken) {
//             window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
//                 if (response && !response.error) {
//                     setPages(response.data);
//                 }
//             });
//         }
//     };

//     const handlePostOnFacebook = async () => {
//         if (!selectedPage) {
//             console.error('No page selected.');
//             return;
//         }

//         const accessToken = localStorage.getItem('facebookAccessToken');
//         const formData = new FormData();
//         formData.append('message', postMessage);
//         if (postImage) {
//             formData.append('source', postImage);
//         }

//         try {
//             const response = await fetch(
//                 `https://graph.facebook.com/${selectedPage.id}/photos?access_token=${accessToken}`,
//                 {
//                     method: 'POST',
//                     body: formData,
//                 }
//             );

//             const result = await response.json();
//             if (result.id) {
//                 fetchPostEngagement(result.id);
//             }
//         } catch (error) {
//             console.error('Error posting on Facebook:', error);
//         }
//     };

//     const fetchPostEngagement = (postId) => {
//         // Simulated engagement with mock data until permission is granted
//         const mockComments = [
//             { user: 'John Doe', message: 'Great post!' },
//             { user: 'Jane Smith', message: 'I love this content!' },
//             { user: 'Alex Johnson', message: 'Keep it up!' }
//         ];

//         const mockLikes = [
//             { user: 'John Doe' },
//             { user: 'Jane Smith' },
//             { user: 'Alex Johnson' }
//         ];

//         // Simulating the engagement with mock data
//         setPostEngagements(mockComments);
//         setLikes(mockLikes);
//     };

//     const handleLogout = () => {
//         window.FB.logout((response) => {
//             console.log('Logged out from Facebook:', response);
//             setLoginStatus('not_logged_in');
//             localStorage.removeItem('facebookAccessToken');
//             setPages([]);
//             setSelectedPage(null);
//             setPostMessage('');
//             setPostImage(null);
//             setPostEngagements([]);
//             setLikes([]);
//         });
//     };

//     useEffect(() => {
//         const loadFacebookSDK = () => {
//             if (window.FB) {
//                 window.FB.getLoginStatus((response) => {
//                     statusChangeCallback(response);
//                 });
//             } else {
//                 const script = document.createElement('script');
//                 script.src = "https://connect.facebook.net/en_US/sdk.js";
//                 script.async = true;
//                 script.onload = () => {
//                     window.FB.init({
//                         appId: '1332019044439778',
//                         cookie: true,
//                         xfbml: true,
//                         version: 'v17.0',
//                     });
//                     window.FB.getLoginStatus((response) => {
//                         statusChangeCallback(response);
//                     });
//                 };
//                 document.body.appendChild(script);
//             }
//         };

//         loadFacebookSDK();
//     }, [statusChangeCallback]);

//     const handleLogin = () => {
//         const configId = '2931675596973062'; // Your configuration ID
//         const loginUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=1332019044439778&redirect_uri=https://smp-be-mysql.vercel.app/auth/facebook/callback&state=some_string&config_id=${configId}`;

//         // Redirect to the Facebook login URL
//         window.location.href = loginUrl;
//     };

//     return (
//         <div className="facebook-container">
//             <h2>Facebook Integration</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div>
//                     {loginStatus === 'connected' ? (
//                         <div>
//                             <p>Logged in with Facebook.</p>

//                             {/* Logout Button */}
//                             <button onClick={handleLogout} className="logout-button">Log Out</button>

//                             {/* Select Page */}
//                             {pages.length > 0 && (
//                                 <div className="page-list">
//                                     <h3>Select a Page</h3>
//                                     {pages.map((page) => (
//                                         <button key={page.id} onClick={() => setSelectedPage(page)}>
//                                             {page.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Post Input */}
//                             {selectedPage && (
//                                 <div className="post-section">
//                                     <p>Selected Page: {selectedPage.name}</p>
//                                     <textarea
//                                         placeholder="Write your post..."
//                                         value={postMessage}
//                                         onChange={(e) => setPostMessage(e.target.value)}
//                                     ></textarea>
//                                     <input
//                                         type="file"
//                                         onChange={(e) => setPostImage(e.target.files[0])}
//                                     />
//                                     <button onClick={handlePostOnFacebook}>Post on Facebook</button>
//                                 </div>
//                             )}

//                             {/* Post Engagements */}
//                             {postEngagements.length > 0 && (
//                                 <div className="engagement-section">
//                                     <h3>Comments</h3>
//                                     {postEngagements.map((comment, index) => (
//                                         <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Post Likes */}
//                             {likes.length > 0 && (
//                                 <div className="engagement-section">
//                                     <h3>Likes</h3>
//                                     <p>{likes.length} Likes</p>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div>
//                             <p>Not logged in with Facebook.</p>
//                             <button onClick={handleLogin}>Login with Facebook</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;


import React, { useEffect, useState, useCallback } from 'react';
import './FacebookLoginCheck.css';

const FacebookLoginCheck = () => {
    const [loginStatus, setLoginStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);
    const [postEngagements, setPostEngagements] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [postMessage, setPostMessage] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [likes, setLikes] = useState([]);

    const FACEBOOK_CLIENT_ID = '1332019044439778'; // Your appId
    const FACEBOOK_CONFIG_ID = '515225758097151'; // Your config_id
    const FACEBOOK_CLIENT_SECRET = '84b1a81f8b8129f43983db4e9692a39a'; // Replace this with your actual secret

    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            const { accessToken } = response.authResponse;
            localStorage.setItem('facebookAccessToken', accessToken);
            setLoginStatus('connected');
            fetchUserPages();
        } else {
            setLoginStatus('not_logged_in');
        }
        setLoading(false);
    }, []);

    const fetchUserPages = () => {
        const accessToken = localStorage.getItem('facebookAccessToken');
        if (accessToken) {
            window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
                if (response && !response.error) {
                    setPages(response.data);
                }
            });
        }
    };

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

    const fetchPostEngagement = (postId) => {
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
    };

    const handleLogout = () => {
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
    };

    useEffect(() => {
        const loadFacebookSDK = () => {
            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                const js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');

            window.fbAsyncInit = () => {
                window.FB.init({
                    appId: FACEBOOK_CLIENT_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v20.0',
                    config_id: FACEBOOK_CONFIG_ID,
                });
                window.FB.getLoginStatus((response) => {
                    statusChangeCallback(response);
                });
            };
        };

        loadFacebookSDK();
    }, [statusChangeCallback]);

    const handleLogin = () => {
        window?.FB?.login((response) => {
            if (response.authResponse) {
                // Get the authorization code
                const { code } = response.authResponse;
                // Exchange the code for access token (this call should be made from your backend)
                fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`, {
                    method: 'GET',
                })
                    .then(res => res.json())
                    .then(data => {
                        // Store the access token in localStorage or manage it as needed
                        const { access_token } = data;
                        localStorage.setItem('facebookAccessToken', access_token);
                        setLoginStatus('connected');
                    })
                    .catch((error) => console.error('Error exchanging code for access token:', error));
            } else {
                console.error('User did not authorize the app.');
            }
        }, { config_id: FACEBOOK_CONFIG_ID, response_type: 'code', override_default_response_type: true });
    };

    return (
        <div className="facebook-container">
            <h2>Facebook Integration</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {loginStatus === 'connected' ? (
                        <div>
                            <p>Logged in with Facebook.</p>
                            <button onClick={handleLogout} className="logout-button">Log Out</button>

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

                            {postEngagements.length > 0 && (
                                <div className="engagement-section">
                                    <h3>Comments</h3>
                                    {postEngagements.map((comment, index) => (
                                        <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
                                    ))}
                                </div>
                            )}

                            {likes.length > 0 && (
                                <div className="engagement-section">
                                    <h3>Likes</h3>
                                    <p>{likes.length} Likes</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>Not logged in with Facebook.</p>
                            <button onClick={handleLogin}>Login with Facebook</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacebookLoginCheck;
