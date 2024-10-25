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


// import React, { useEffect, useState, useCallback } from 'react';
// import './FacebookLoginCheck.css';

// const FacebookLoginCheck = () => {
//     const [loginStatus, setLoginStatus] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [pages, setPages] = useState([]);
//     const [postEngagements, setPostEngagements] = useState([]);
//     const [selectedPage, setSelectedPage] = useState(null);
//     const [postMessage, setPostMessage] = useState('');
//     const [postImage, setPostImage] = useState(null);
//     const [likes, setLikes] = useState([]);

//     const FACEBOOK_CLIENT_ID = '1332019044439778'; // Your appId
//     const FACEBOOK_CONFIG_ID = '515225758097151'; // Your config_id
//     const FACEBOOK_CLIENT_SECRET = '84b1a81f8b8129f43983db4e9692a39a'; // Replace this with your actual secret

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             const { accessToken } = response.authResponse;
//             localStorage.setItem('facebookAccessToken', accessToken);
//             setLoginStatus('connected');
//             fetchUserPages();
//         } else {
//             setLoginStatus('not_logged_in');
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
//             (function (d, s, id) {
//                 const fjs = d.getElementsByTagName(s)[0];
//                 if (d.getElementById(id)) return;
//                 const js = d.createElement(s);
//                 js.id = id;
//                 js.src = 'https://connect.facebook.net/en_US/sdk.js';
//                 fjs.parentNode.insertBefore(js, fjs);
//             })(document, 'script', 'facebook-jssdk');

//             window.fbAsyncInit = () => {
//                 window.FB.init({
//                     appId: FACEBOOK_CLIENT_ID,
//                     cookie: true,
//                     xfbml: true,
//                     version: 'v20.0',
//                     config_id: FACEBOOK_CONFIG_ID,
//                 });
//                 window.FB.getLoginStatus((response) => {
//                     statusChangeCallback(response);
//                 });
//             };
//         };

//         loadFacebookSDK();
//     }, [statusChangeCallback]);

//     const handleLogin = () => {
//         window?.FB?.login((response) => {
//             if (response.authResponse) {
//                 // Get the authorization code
//                 const { code } = response.authResponse;
//                 // Exchange the code for access token (this call should be made from your backend)
//                 fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`, {
//                     method: 'GET',
//                 })
//                     .then(res => res.json())
//                     .then(data => {
//                         // Store the access token in localStorage or manage it as needed
//                         const { access_token } = data;
//                         localStorage.setItem('facebookAccessToken', access_token);
//                         setLoginStatus('connected');
//                     })
//                     .catch((error) => console.error('Error exchanging code for access token:', error));
//             } else {
//                 console.error('User did not authorize the app.');
//             }
//         }, { config_id: FACEBOOK_CONFIG_ID, response_type: 'code', override_default_response_type: true });
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
//                             <button onClick={handleLogout} className="logout-button">Log Out</button>

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

//                             {postEngagements.length > 0 && (
//                                 <div className="engagement-section">
//                                     <h3>Comments</h3>
//                                     {postEngagements.map((comment, index) => (
//                                         <p key={index}><strong>{comment.user}:</strong> {comment.message}</p>
//                                     ))}
//                                 </div>
//                             )}

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




// import './FacebookLoginCheck.css';

// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');

//     // Function to handle status change
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     // Fetch pages after login
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Login to Facebook
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else {
//                 console.error('Facebook login failed:', response);
//             }
//         }, { scope: 'email, public_profile, pages_show_list, pages_manage_posts' });
//     };

//     // Handle post submission to the selected page
//     const postToPage = (pageId, accessToken, message) => {
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken },
//             function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page');
//                 } else {
//                     alert('Post published successfully!');
//                 }
//             }
//         );
//     };

//     // Handle the post button click
//     const handlePost = () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             postToPage(selectedPageId, selectedPage.access_token, message);
//         } else {
//             alert('Please select a page to post to.');
//         }
//     };

//     // Initialize Facebook SDK and check login status
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your actual Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // Check login status
//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the SDK asynchronously
//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]); // Added statusChangeCallback as a dependency to avoid eslint warning

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;




// import './FacebookLoginCheck.css';

// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');

//     // Function to handle status change
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     // Fetch pages after login
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Login to Facebook
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else {
//                 console.error('Facebook login failed:', response);
//             }
//         }, { scope: 'email, public_profile, pages_show_list, pages_manage_posts' });
//     };

//     // Handle post submission to the selected page
//     const postToPage = async (pageId, accessToken, message) => {
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken },
//             async function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page');
//                 } else {
//                     alert('Post published successfully!');
//                     // After posting to Facebook, save the post to your database
//                     await savePostToDatabase(pageId, message);
//                 }
//             }
//         );
//     };

//     // Function to save the post to the database
//     const savePostToDatabase = async (pageId, message) => {
//         const userId = 'YOUR_USER_ID'; // Replace with the actual user ID
//         try {
//             const response = await fetch('/api/posts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId, pageId, message }),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to save post to database');
//             }
//         } catch (error) {
//             console.error('Error saving post to database:', error);
//         }
//     };

//     // Handle the post button click
//     const handlePost = () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             postToPage(selectedPageId, selectedPage.access_token, message);
//         } else {
//             alert('Please select a page to post to.');
//         }
//     };

//     // Initialize Facebook SDK and check login status
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your actual Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // Check login status
//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the SDK asynchronously
//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]); // Added statusChangeCallback as a dependency to avoid eslint warning

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;








// import './FacebookLoginCheck.css';
// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [userId, setUserId] = useState(null);

//     // Function to handle status change
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchUserData(response.authResponse.userID); // Fetch the user ID from response
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const fetchUserData = (id) => {
//         // Store the user ID in a state variable
//         setUserId(id);
//     };

//     // Fetch pages after login
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Login to Facebook
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else {
//                 console.error('Facebook login failed:', response);
//             }
//         }, { scope: 'email, public_profile, pages_show_list, pages_manage_posts' });
//     };

//     // Handle post submission to the selected page
//     const postToPage = async (pageId, accessToken, message) => {
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken },
//             async function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page');
//                 } else {
//                     alert('Post published successfully!');
//                     // After posting to Facebook, save the post to your database
//                     await savePostToDatabase(pageId, message);
//                 }
//             }
//         );
//     };

//     // Function to save the post to the database
//     const savePostToDatabase = async (pageId, message) => {
//         const currentUserId = userId; // Use a different variable name here
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: currentUserId, pageId, message }), // Use currentUserId instead
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to save post to database');
//             }
//             const result = await response.json(); // Handle the response data if needed
//             console.log('Post saved to database:', result); // Log the saved post
//         } catch (error) {
//             console.error('Error saving post to database:', error);
//         }
//     };

//     // Handle the post button click
//     const handlePost = () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             if (!userId) {
//                 alert('User ID is missing. Please log in again.');
//                 return;
//             }
//             postToPage(selectedPageId, selectedPage.access_token, message);
//         } else {
//             alert('Please select a page to post to.');
//         }
//     };

//     // Initialize Facebook SDK and check login status
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your actual Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // Check login status
//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the SDK asynchronously
//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]); // Added statusChangeCallback as a dependency to avoid eslint warning

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;


// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(null);

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchUserData(response.authResponse);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const fetchUserData = (authResponse) => {
//         window.FB.api('/me', { fields: 'name,email', access_token: authResponse.accessToken }, async (userResponse) => {
//             if (userResponse && !userResponse.error) {
//                 const userInfo = {
//                     userId: userResponse.id,
//                     name: userResponse.name,
//                     email: userResponse.email,
//                     accessToken: authResponse.accessToken
//                 };
//                 setUserData(userInfo);
//                 await saveFacebookUser(userInfo); // Save user data to your backend
//             } else {
//                 console.error('Error fetching user data:', userResponse.error);
//             }
//         });
//     };

//     const saveFacebookUser = async (userInfo) => {
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/facebook/save-user', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userInfo),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to save Facebook user');
//             }
//             console.log('Facebook user saved to database');
//         } catch (error) {
//             console.error('Error saving user to database:', error);
//         }
//     };

//     const loginWithFacebook = () => {
//         window.FB.login((response) => {
//             if (response.status === 'connected') {
//                 statusChangeCallback(response);
//             } else {
//                 console.error('Facebook login failed:', response);
//             }
//         }, { scope: 'public_profile,email' });
//     };

//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0',
//             });
//             window.FB.getLoginStatus((response) => {
//                 statusChangeCallback(response);
//             });
//         };

//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Facebook Login</h1>
//             {!isLoggedIn ? (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             ) : (
//                 <div>
//                     <h2>Welcome, {userData?.name}</h2>
//                     <p>Email: {userData?.email}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;


// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(null);

//     // Define the status change callback within useCallback
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             const { accessToken } = response.authResponse;
//             // Fetch user data
//             window.FB.api('/me', { fields: 'name,email', access_token: accessToken }, async (userResponse) => {
//                 if (userResponse && !userResponse.error) {
//                     const userInfo = {
//                         userId: userResponse.id,
//                         name: userResponse.name,
//                         email: userResponse.email,
//                         accessToken: accessToken
//                     };
//                     setUserData(userInfo);
//                     await saveFacebookUser(userInfo); // Save user data to your backend
//                 } else {
//                     console.error('Error fetching user data:', userResponse.error);
//                 }
//             });
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const saveFacebookUser = async (userInfo) => {
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/facebook/save-user', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userInfo),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to save Facebook user');
//             }
//             console.log('Facebook user saved to database');
//         } catch (error) {
//             console.error('Error saving user to database:', error);
//         }
//     };

//     // Function to log in with Facebook
//     const loginWithFacebook = () => {
//         window.FB.login((response) => {
//             if (response.status === 'connected') {
//                 statusChangeCallback(response);
//             } else {
//                 console.error('Facebook login failed:', response);
//             }
//         }, { scope: 'public_profile,email,pages_show_list,pages_manage_posts' });
//     };

//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0',
//                 config_id: '1273277580768760',
//                 // response_type: 'code'
//             });
//             window.FB.getLoginStatus((response) => {
//                 statusChangeCallback(response);
//             });
//         };

//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Facebook Login</h1>
//             {!isLoggedIn ? (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             ) : (
//                 <div>
//                     <h2>Welcome, {userData?.name}</h2>
//                     <p>Email: {userData?.email}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;



// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [userId, setUserId] = useState(null);


//     // Function to handle status change
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchUserData(response.authResponse.userID);
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const fetchUserData = (id) => {
//         console.log("Fetched User ID:", id); // Log the ID
//         setUserId(id);
//     };

//     // Fetch pages after login
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Login to Facebook
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else if (response.status === 'not_authorized') {
//                 // User logged in to Facebook, but not authorized the app
//                 console.error('App not authorized by the user:', response);
//                 alert('You need to authorize the app to manage your Facebook pages.');
//             } else {
//                 // User is not logged in to Facebook at all
//                 console.error('Facebook login failed:', response);
//                 alert('Facebook login failed. Please try again.');
//             }
//         }, {
//             scope: 'email, public_profile, pages_show_list, pages_manage_posts', // Re-enable this line
//             config_id: '1273277580768760' // Use your Configuration ID here
//         });
//     };

//     // Handle post submission to the selected page
//     const postToPage = async (pageId, accessToken, message) => {
//         console.log("Posting to page:", { pageId, accessToken, message });
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken },
//             async function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page');
//                 } else {
//                     alert('Post published successfully!');
//                     // After posting to Facebook, save the post to your database
//                     await savePostToDatabase(pageId, message);
//                 }
//             }
//         );
//     };

//     const savePostToDatabase = async (pageId, message) => {
//         const currentUserId = userId; // Ensure userId is correct
//         console.log("Saving post with data:", { userId: currentUserId, pageId, message }); // Debug the payload
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: currentUserId, pageId, message }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json(); // Get more info about the error
//                 throw new Error(`Failed to save post to database: ${errorData.error || response.statusText}`);
//             }

//             const result = await response.json();
//             console.log('Post saved to database:', result);
//         } catch (error) {
//             console.error('Error saving post to database:', error);
//         }
//     };


//     // Handle the post button click
//     const handlePost = () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             if (!userId) {
//                 alert('User ID is missing. Please log in again.');
//                 return;
//             }
//             postToPage(selectedPageId, selectedPage.access_token, message);
//         } else {
//             alert('Please select a page to post to.');
//         }
//     };

//     // Initialize Facebook SDK and check login status
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your actual Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // Check login status
//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the SDK asynchronously
//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;













// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [userId, setUserId] = useState(null);
//     const [accessToken, setAccessToken] = useState(null); // Store access token globally

//     // Function to handle status change
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             const authResponse = response.authResponse;
//             setIsLoggedIn(true);
//             setAccessToken(authResponse.accessToken); // Save access token
//             fetchUserData(authResponse.userID);
//             fetchPages(authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     // Fetch user data based on login
//     const fetchUserData = (id) => {
//         console.log("Fetched User ID:", id); // Log the ID
//         setUserId(id); // Save user ID for database usage
//     };

//     // Fetch pages associated with the logged-in user
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data); // Save pages to state
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Login to Facebook
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 const authResponse = response.authResponse;
//                 setIsLoggedIn(true);
//                 setAccessToken(authResponse.accessToken); // Save access token
//                 fetchPages(authResponse.accessToken);
//             } else if (response.status === 'not_authorized') {
//                 console.error('App not authorized by the user:', response);
//                 alert('You need to authorize the app to manage your Facebook pages.');
//             } else {
//                 console.error('Facebook login failed:', response);
//                 alert('Facebook login failed. Please try again.');
//             }
//         }, {
//             scope: 'email, public_profile, pages_show_list, pages_manage_posts', // Permissions
//             config_id: '1273277580768760' // Use your Configuration ID here
//         });
//     };

//     // Post to the selected page
//     const postToPage = async (pageId, message) => {
//         const page = pages.find(page => page.id === pageId);
//         if (!page) {
//             alert('Page not found. Please select a valid page.');
//             return;
//         }

//         console.log("Posting to page:", { pageId, accessToken, message });
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken }, // Pass access token explicitly
//             async function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page.');
//                 } else {
//                     alert('Post published successfully!');
//                     await savePostToDatabase(pageId, message);
//                 }
//             }
//         );
//     };

//     // Save post to the database
//     const savePostToDatabase = async (pageId, message) => {
//         const currentUserId = userId; // Ensure userId is set correctly
//         if (!currentUserId) {
//             alert('User ID is missing. Please log in again.');
//             return;
//         }

//         console.log("Saving post with data:", { userId: currentUserId, pageId, message });
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: currentUserId, pageId, message }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`Failed to save post to database: ${errorData.error || response.statusText}`);
//             }

//             const result = await response.json();
//             console.log('Post saved to database:', result);
//         } catch (error) {
//             console.error('Error saving post to database:', error);
//         }
//     };

//     // Handle the post button click
//     const handlePost = () => {
//         if (!selectedPageId) {
//             alert('Please select a page to post to.');
//             return;
//         }

//         if (!message.trim()) {
//             alert('Please enter a message to post.');
//             return;
//         }

//         postToPage(selectedPageId, message); // Post to the selected page
//     };

//     // Initialize Facebook SDK and check login status
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your actual Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // Check login status after SDK initialization
//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the Facebook SDK asynchronously
//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;






// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [userId, setUserId] = useState(null);

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchUserData(response.authResponse.userID);
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const fetchUserData = (id) => {
//         console.log("Fetched User ID:", id);
//         setUserId(id);
//     };

//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else if (response.status === 'not_authorized') {
//                 console.error('App not authorized by the user:', response);
//                 alert('You need to authorize the app to manage your Facebook pages.');
//             } else {
//                 console.error('Facebook login failed:', response);
//                 alert('Facebook login failed. Please try again.');
//             }
//         }, {
//             scope: 'email, public_profile, pages_show_list, pages_manage_posts',
//             config_id: '1273277580768760' // Use your Configuration ID here
//         });
//     };

//     const postToPage = async (pageId, accessToken, message) => {
//         console.log("Posting to page:", { pageId, accessToken, message });
//         window.FB.api(
//             `/${pageId}/feed`,
//             'POST',
//             { message, access_token: accessToken },
//             async function (response) {
//                 if (!response || response.error) {
//                     console.error('Error posting:', response.error);
//                     alert('Error posting to the page: ' + (response.error.message || 'Unknown error'));
//                 } else {
//                     alert('Post published successfully!');
//                     await savePostToDatabase(pageId, message);
//                 }
//             }
//         );
//     };

//     // const savePostToDatabase = async (pageId, message) => {
//     //     const currentUserId = userId;
//     //     console.log("Saving post with data:", { userId: currentUserId, pageId, message });
//     //     try {
//     //         console.log("Saving post with data:", { userId: currentUserId, pageId, message });
//     //         const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify({ userId: currentUserId, pageId, message }),
//     //         });

//     //         if (!response.ok) {
//     //             const errorData = await response.json();
//     //             throw new Error(`Failed to save post to database: ${errorData.error || response.statusText}`);
//     //         }

//     //         const result = await response.json();
//     //         console.log('Post saved to database:', result);
//     //     } catch (error) {
//     //         console.error('Error saving post to database:', error);
//     //     }
//     // };

//     // const handlePost = () => {
//     //     const selectedPage = pages.find(page => page.id === selectedPageId);
//     //     if (selectedPage) {
//     //         if (!userId) {
//     //             alert('User ID is missing. Please log in again.');
//     //             return;
//     //         }
//     //         postToPage(selectedPageId, selectedPage.access_token, message);
//     //     } else {
//     //         alert('Please select a page to post to.');
//     //     }
//     // };
//     const handlePost = () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             if (!userId) {
//                 alert('User ID is missing. Please log in again.');
//                 return;
//             }

//             // Call postToPage first to post on Facebook
//             postToPage(selectedPageId, selectedPage.access_token, message)
//                 .then(() => {
//                     // After successful Facebook post, save post to the database
//                     savePostToDatabase(selectedPageId, message);
//                 })
//                 .catch((error) => {
//                     console.error('Error posting to Facebook:', error);
//                 });
//         } else {
//             alert('Please select a page to post to.');
//         }
//     };

//     const savePostToDatabase = async (pageId, message) => {
//         const currentUserId = userId;
//         console.log("Initiating save with data:", { userId: currentUserId, pageId, message });
//         try {
//             const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ userId: currentUserId, pageId, message }),
//             });

//             console.log('Database save response status:', response.status);
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error('Backend response error:', errorData);
//                 throw new Error(`Failed to save post to database: ${errorData.error || response.statusText}`);
//             }

//             const result = await response.json();
//             console.log('Post successfully saved to database:', result);
//         } catch (error) {
//             console.error('Error saving post to database:', error);
//         }
//     };


//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778',
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             window.FB.getLoginStatus(function (response) {
//                 statusChangeCallback(response);
//             });
//         };

//         (function (d, s, id) {
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Facebook Page Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithFacebook}>Login with Facebook</button>
//             )}

//             {isLoggedIn && pages.length > 0 && (
//                 <div>
//                     <h2>Select a Page to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedPageId(e.target.value)}
//                         value={selectedPageId}
//                     >
//                         <option value="">Select Page</option>
//                         {pages.map((page) => (
//                             <option key={page.id} value={page.id}>
//                                 {page.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePost}>Post to Page</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookLoginCheck;




import React, { useState, useEffect, useCallback } from 'react';

const FacebookLoginCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [file, setFile] = useState(null); // New state for storing file

    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            setIsLoggedIn(true);
            fetchUserData(response.authResponse.userID);
            fetchPages(response.authResponse.accessToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = (id) => {
        setUserId(id);
    };

    const fetchPages = (accessToken) => {
        window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
            if (response && !response.error) {
                setPages(response.data);
            } else {
                console.error('Error fetching pages:', response.error);
            }
        });
    };

    const loginWithFacebook = () => {
        window.FB.login(function (response) {
            if (response.status === 'connected') {
                setIsLoggedIn(true);
                fetchPages(response.authResponse.accessToken);
            } else if (response.status === 'not_authorized') {
                alert('You need to authorize the app to manage your Facebook pages.');
            } else {
                alert('Facebook login failed. Please try again.');
            }
        }, {
            scope: 'email, public_profile, pages_show_list, pages_manage_posts',
            config_id: '1273277580768760' // Replace with your Configuration ID
        });
    };

    const postToPage = async (pageId, accessToken, message, file) => {
        const formData = new FormData();
        let apiUrl = `/${pageId}`;

        if (file) {
            formData.append('source', file);
            apiUrl += '/photos'; // Use /photos for images or /videos for videos
        } else {
            apiUrl += '/feed';
        }

        formData.append('message', message);
        formData.append('access_token', accessToken);

        window.FB.api(apiUrl, 'POST', formData, function (response) {
            if (!response || response.error) {
                console.error('Error posting:', response.error);
                alert('Error posting to the page: ' + (response.error.message || 'Unknown error'));
            } else {
                alert('Post published successfully!');
                // Save the post to your database, if needed
            }
        });
    };


    // const savePostToDatabase = async (pageId, message, file) => {
    //     const currentUserId = userId;
    //     try {
    //         const response = await fetch('https://smp-be-mysql.vercel.app/post/save', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ userId: currentUserId, pageId, message, media: file ? file.name : null }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(`Failed to save post to database: ${errorData.error || response.statusText}`);
    //         }

    //         const result = await response.json();
    //         console.log('Post saved to database:', result);
    //     } catch (error) {
    //         console.error('Error saving post to database:', error);
    //     }
    // };

    const handlePost = () => {
        const selectedPage = pages.find(page => page.id === selectedPageId);
        if (selectedPage) {
            if (!userId) {
                alert('User ID is missing. Please log in again.');
                return;
            }
            postToPage(selectedPageId, selectedPage.access_token, message, file);
        } else {
            alert('Please select a page to post to.');
        }
    };

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1332019044439778',
                cookie: true,
                xfbml: true,
                version: 'v20.0'
            });

            window.FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        };

        (function (d, s, id) {
            const js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            const fjs = d.getElementsByTagName(s)[0];
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }, [statusChangeCallback]);

    return (
        <div>
            <h1>Facebook Page Manager</h1>

            {!isLoggedIn && (
                <button onClick={loginWithFacebook}>Login with Facebook</button>
            )}

            {isLoggedIn && pages.length > 0 && (
                <div>
                    <h2>Select a Page to Post</h2>
                    <select
                        onChange={(e) => setSelectedPageId(e.target.value)}
                        value={selectedPageId}
                    >
                        <option value="">Select Page</option>
                        {pages.map((page) => (
                            <option key={page.id} value={page.id}>
                                {page.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Write your post"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button onClick={handlePost}>Post to Page</button>
                </div>
            )}
        </div>
    );
};

export default FacebookLoginCheck;


