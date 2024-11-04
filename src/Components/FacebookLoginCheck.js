
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
import React, { useState, useEffect, useCallback } from 'react';

const FacebookLoginCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [files, setFiles] = useState([]);
    const [instagramAccountId, setInstagramAccountId] = useState(null);
    const [instagramAccessToken, setInstagramAccessToken] = useState('');

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

    const fetchInstagramAccount = useCallback(async (accessToken) => {
        window.FB.api('/me/accounts', { access_token: accessToken }, async function (response) {
            if (response && !response.error) {
                const page = response.data.find(page => page.id === selectedPageId);
                if (page) {
                    const igAccountResponse = await fetch(`https://graph.facebook.com/v13.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                    const igAccountData = await igAccountResponse.json();
                    if (igAccountData.instagram_business_account) {
                        const instagramId = igAccountData.instagram_business_account.id;
                        setInstagramAccountId(instagramId);
                        setInstagramAccessToken(accessToken); // Set Instagram access token here
                        console.log('Instagram Account ID:', instagramId); // Log the Instagram account ID
                    } else {
                        console.error('No linked Instagram account found.');
                    }
                } else {
                    console.error('Selected page not found.');
                }
            } else {
                console.error('Error fetching pages:', response.error);
            }
        });
    }, [selectedPageId]);


    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            setIsLoggedIn(true);
            fetchUserData(response.authResponse.userID);
            fetchPages(response.authResponse.accessToken);
            fetchInstagramAccount(response.authResponse.accessToken);
        } else {
            setIsLoggedIn(false);
        }
    }, [fetchInstagramAccount]);

    const loginWithFacebook = () => {
        window.FB.login(function (response) {
            if (response.status === 'connected') {
                setIsLoggedIn(true);
                fetchPages(response.authResponse.accessToken);
                fetchInstagramAccount(response.authResponse.accessToken);
            } else if (response.status === 'not_authorized') {
                alert('You need to authorize the app to manage your Facebook pages.');
            } else {
                alert('Facebook login failed. Please try again.');
            }
        }, {
            scope: 'email, public_profile, pages_show_list, pages_manage_posts, instagram_basic',
            config_id: '1273277580768760'
        });
    };

    const handlePost = async () => {
        const selectedPage = pages.find(page => page.id === selectedPageId);
        if (selectedPage) {
            if (!userId) {
                alert('User ID is missing. Please log in again.');
                return;
            }

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            if (message) {
                formData.append('caption', message);
            }

            formData.append('accessToken', selectedPage.access_token);
            formData.append('pageId', selectedPageId);

            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Upload result:', result);

                // Post to Instagram after successful upload
                await handleInstagramPost(files, message, instagramAccessToken);
            } catch (error) {
                console.error('Error uploading to backend:', error);
                alert(`Error uploading: ${error.message}`);
            }
        } else {
            alert('Please select a page to post to.');
        }
    };

    const handleInstagramPost = async (mediaFiles, caption, instagramAccessToken) => {
        if (!instagramAccountId) {
            console.error('Instagram Account ID is null. Cannot upload media.');
            return;
        }

        try {
            console.log('Uploading to Instagram Account ID:', instagramAccountId); // Log to verify ID

            const mediaUploadResponse = await fetch(`https://graph.facebook.com/v13.0/${instagramAccountId}/media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_url: mediaFiles[0], // Ensure this is a valid URL for the media
                    caption: caption,
                    access_token: instagramAccessToken,
                }),
            });

            const mediaUploadResult = await mediaUploadResponse.json();
            if (mediaUploadResult.id) {
                const publishResponse = await fetch(`https://graph.facebook.com/v13.0/${instagramAccountId}/media_publish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creation_id: mediaUploadResult.id,
                        access_token: instagramAccessToken,
                    }),
                });

                const publishResult = await publishResponse.json();
                console.log('Instagram Post Result:', publishResult);
            } else {
                console.error('Error uploading media to Instagram:', mediaUploadResult);
            }
        } catch (error) {
            console.error('Error posting to Instagram:', error);
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
