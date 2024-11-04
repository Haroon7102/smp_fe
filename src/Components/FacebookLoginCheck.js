
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

const SocialMediaManager = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    // const [instagramAccount, setInstagramAccount] = useState(null);

    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            setIsLoggedIn(true);
            fetchPages(response.authResponse.accessToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchPages = (accessToken) => {
        window.FB.api('/me/accounts', { access_token: accessToken }, (response) => {
            if (response && !response.error) {
                const pagesWithInstagram = response.data.map((page) =>
                    new Promise((resolve) => {
                        window.FB.api(
                            `/${page.id}?fields=instagram_business_account`,
                            { access_token: accessToken },
                            (igResponse) => {
                                if (igResponse && !igResponse.error) {
                                    resolve({
                                        ...page,
                                        instagramAccount: igResponse.instagram_business_account,
                                    });
                                } else {
                                    resolve({ ...page, instagramAccount: null });
                                }
                            }
                        );
                    })
                );

                // Wait for all pages' Instagram account info to be fetched
                Promise.all(pagesWithInstagram).then((pagesWithIG) => {
                    setPages(pagesWithIG);
                });
            } else {
                console.error('Error fetching pages:', response.error);
            }
        });
    };


    const loginWithFacebook = () => {
        window.FB.login((response) => {
            if (response.status === 'connected') {
                setIsLoggedIn(true);
                fetchPages(response.authResponse.accessToken);
            } else {
                alert('Facebook login failed.');
            }
        }, { scope: 'email, public_profile, pages_show_list, pages_manage_posts, instagram_basic, instagram_content_publish' });
    };

    const handleFacebookPost = async () => {
        const selectedPage = pages.find(page => page.id === selectedPageId);
        if (selectedPage) {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            formData.append('caption', message);
            formData.append('accessToken', selectedPage.access_token);
            formData.append('pageId', selectedPageId);

            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log('Facebook post result:', result);
            } catch (error) {
                console.error('Facebook upload error:', error);
            }
        } else {
            alert('Please select a page.');
        }
    };

    const handleInstagramPost = async () => {
        const selectedPage = pages.find((page) => page.id === selectedPageId);

        if (!selectedPage) {
            alert('Please select a page to post to.');
            return;
        }

        if (!selectedPage.instagramAccount) {
            alert('No Instagram account linked with the selected page.');
            return;
        }

        const formData = new FormData();
        formData.append('instagramAccountId', selectedPage.instagramAccount.id);
        formData.append('accessToken', selectedPage.access_token);
        formData.append('caption', message);

        if (files[0]) {
            formData.append('mediaUrl', URL.createObjectURL(files[0]));
        }

        try {
            const response = await fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            console.log('Instagram post result:', result);
        } catch (error) {
            console.error('Instagram upload error:', error);
        }
    };


    useEffect(() => {
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: '1332019044439778',
                cookie: true,
                xfbml: true,
                version: 'v20.0'
            });
            window.FB.getLoginStatus((response) => statusChangeCallback(response));
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
            <h1>Social Media Manager</h1>
            {!isLoggedIn ? (
                <button onClick={loginWithFacebook}>Login with Facebook</button>
            ) : (
                <div>
                    <h2>Select a Page to Post</h2>
                    <select onChange={(e) => setSelectedPageId(e.target.value)} value={selectedPageId}>
                        <option value="">Select Page</option>
                        {pages.map((page) => (
                            <option key={page.id} value={page.id}>{page.name}</option>
                        ))}
                    </select>
                    <textarea placeholder="Write your post" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <input type="file" accept="image/*,video/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
                    <button onClick={handleFacebookPost}>Post to Facebook</button>
                    <button onClick={handleInstagramPost}>Post to Instagram</button>
                </div>
            )}
        </div>
    );
};

export default SocialMediaManager;
