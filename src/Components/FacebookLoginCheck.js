
// import React, { useState, useEffect, useCallback } from 'react';

// const FacebookLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [pages, setPages] = useState([]);
//     const [selectedPageId, setSelectedPageId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [userId, setUserId] = useState(null);
//     const [files, setFiles] = useState([]); // Handle multiple files

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
//                 alert('You need to authorize the app to manage your Facebook pages.');
//             } else {
//                 alert('Facebook login failed. Please try again.');
//             }
//         }, {
//             scope: 'email, public_profile, pages_show_list, pages_manage_posts',
//             config_id: '1273277580768760'
//         });
//     };

//     const handlePost = async () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             if (!userId) {
//                 alert('User ID is missing. Please log in again.');
//                 return;
//             }

//             const formData = new FormData();

//             // Append each file to FormData
//             files.forEach((file) => {
//                 formData.append('files', file); // Ensure 'files' matches what your backend expects
//             });

//             if (message) {
//                 formData.append('caption', message); // Add message as caption
//             }

//             formData.append('accessToken', selectedPage.access_token);
//             formData.append('pageId', selectedPageId);

//             try {
//                 const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/upload', {
//                     method: 'POST',
//                     body: formData,
//                     // Ensure credentials are included if necessary (optional)
//                     // credentials: 'include' // Uncomment if needed
//                 });

//                 // Check if the response is ok
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const result = await response.json();
//                 console.log('Upload result:', result);
//                 // Optionally handle the result (e.g., display a success message)
//             } catch (error) {
//                 console.error('Error uploading to backend:', error);
//                 alert(`Error uploading: ${error.message}`);
//             }
//         } else {
//             alert('Please select a page to post to.');
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

//                     <input
//                         type="file"
//                         accept="image/*,video/*"
//                         multiple
//                         onChange={(e) => setFiles(Array.from(e.target.files))} // Store all selected files
//                     />

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
//     const [message, setMessage] = useState('');  // Caption message
//     const [userId, setUserId] = useState(null);
//     const [files, setFiles] = useState([]); // Handle multiple files (images and videos)

//     // Facebook Login Status Callback
//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchUserData(response.authResponse.userID);
//             fetchPages(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     // Fetch user data
//     const fetchUserData = (id) => {
//         setUserId(id);
//     };

//     // Fetch user's pages
//     const fetchPages = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 setPages(response.data);
//             } else {
//                 console.error('Error fetching pages:', response.error);
//             }
//         });
//     };

//     // Facebook Login
//     const loginWithFacebook = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchPages(response.authResponse.accessToken);
//             } else if (response.status === 'not_authorized') {
//                 alert('You need to authorize the app to manage your Facebook pages.');
//             } else {
//                 alert('Facebook login failed. Please try again.');
//             }
//         }, {
//             scope: 'email, public_profile, pages_show_list, pages_manage_posts',
//         });
//     };

//     // Handle Post (uploading to Facebook)
//     const handlePost = async () => {
//         const selectedPage = pages.find(page => page.id === selectedPageId);
//         if (selectedPage) {
//             if (!userId) {
//                 alert('User ID is missing. Please log in again.');
//                 return;
//             }

//             const formData = new FormData();

//             // Append each selected file to FormData
//             files.forEach((file) => {
//                 formData.append('files', file); // Ensure 'files' matches the backend expectation
//             });

//             if (message) {
//                 formData.append('caption', message); // Add message as caption
//             }

//             formData.append('accessToken', selectedPage.access_token);
//             formData.append('pageId', selectedPageId);

//             try {
//                 const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/upload', {
//                     timeout: 600000,  // Timeout set to 600 seconds (60000 milliseconds)
//                     method: 'POST',
//                     body: formData,
//                 });

//                 // Check if the response is ok
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const result = await response.json();
//                 console.log('Upload result:', result);
//                 alert('Post uploaded successfully!');
//             } catch (error) {
//                 console.error('Error uploading to backend:', error);
//                 alert(`Error uploading: ${error.message}`);
//             }
//         } else {
//             alert('Please select a page to post to.');
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
//                         onChange={(e) => setMessage(e.target.value)} // Update caption
//                     ></textarea>

//                     <input
//                         type="file"
//                         accept="image/*,video/*"
//                         multiple
//                         onChange={(e) => setFiles(Array.from(e.target.files))} // Handle multiple file uploads
//                     />

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
    const [files, setFiles] = useState([]);

    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            setIsLoggedIn(true);
            fetchUserData(response.authResponse.userID);
            fetchPages(response.authResponse.accessToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    console.log('id:', userId);
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
            } else {
                alert('Facebook login failed. Please try again.');
            }
        }, {
            scope: 'email, public_profile, pages_show_list, pages_manage_posts',
        });
    };

    const handlePost = async () => {
        if (!selectedPageId) {
            alert('Please select a page to post to.');
            return;
        }

        const selectedPage = pages.find(page => page.id === selectedPageId);
        if (selectedPage) {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));
            if (message) formData.append('caption', message);

            formData.append('accessToken', selectedPage.access_token);
            formData.append('pageId', selectedPageId);

            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
                    throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
                }

                const result = await response.json();
                console.log('Upload result:', result);
                alert('Post uploaded successfully!');
            } catch (error) {
                console.error('Error uploading to backend:', error);
                alert(`Error uploading: ${error.message}`);
            }
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

            {!isLoggedIn && <button onClick={loginWithFacebook}>Login with Facebook</button>}

            {isLoggedIn && pages.length > 0 && (
                <div>
                    <h2>Select a Page to Post</h2>
                    <select onChange={(e) => setSelectedPageId(e.target.value)} value={selectedPageId}>
                        <option value="">Select Page</option>
                        {pages.map((page) => (
                            <option key={page.id} value={page.id}>{page.name}</option>
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
                        multiple
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                    />

                    <button onClick={handlePost}>Post to Page</button>
                </div>
            )}
        </div>
    );
};

export default FacebookLoginCheck;
