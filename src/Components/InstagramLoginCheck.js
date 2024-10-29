// import React, { useState, useEffect, useCallback } from 'react';

// const InstagramLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [instagramAccounts, setInstagramAccounts] = useState([]);
//     const [selectedInstagramId, setSelectedInstagramId] = useState(null);
//     const [message, setMessage] = useState('');

//     // Status change callback
//     const statusChangeCallback = useCallback((response) => {
//         console.log('FB Login Status Response:', response); // Log response for debugging
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchInstagramAccounts(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     // Fetch Instagram accounts associated with the user's Facebook pages
//     const fetchInstagramAccounts = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             console.log('Fetching pages response:', response); // Log the response
//             if (response && !response.error) {
//                 // Filter pages with linked Instagram accounts
//                 const pagesWithInstagram = response.data.filter(page => page.instagram_business_account);
//                 if (pagesWithInstagram.length === 0) {
//                     alert('No Instagram accounts found linked to your Facebook pages. Please link an Instagram Business account to a Facebook page.');
//                     return;
//                 }
//                 setInstagramAccounts(pagesWithInstagram.map(page => ({
//                     id: page.instagram_business_account.id,
//                     name: page.name
//                 })));
//             } else {
//                 console.error('Error fetching Instagram accounts:', response.error);
//                 alert('Error fetching Instagram accounts. Check console for details.');
//             }
//         });
//     };


//     // Handle Facebook login
//     const loginWithInstagram = () => {
//         window.FB.login((response) => {
//             console.log('FB Login Response:', response); // Log response for debugging
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchInstagramAccounts(response.authResponse.accessToken);
//             } else {
//                 alert('Instagram login failed. Please try again.');
//             }
//         }, {
//             scope: 'instagram_basic, pages_show_list, instagram_content_publish',
//             auth_type: 'rerequest' // Ensures that it re-asks for permissions if declined before
//         });
//     };

//     // Handle posting to Instagram
//     const handlePostToInstagram = async () => {
//         const selectedAccount = instagramAccounts.find(account => account.id === selectedInstagramId);
//         if (selectedAccount) {
//             const formData = new FormData();
//             formData.append('caption', message);
//             formData.append('instagramAccountId', selectedInstagramId);

//             try {
//                 const response = await fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
//                     method: 'POST',
//                     body: formData
//                 });

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const result = await response.json();
//                 console.log('Upload result:', result);
//                 alert(`Post successful! Post ID: ${result.postId}`);
//             } catch (error) {
//                 console.error('Error posting to Instagram:', error);
//                 alert(`Error posting: ${error.message}`);
//             }
//         } else {
//             alert('Please select an Instagram account to post to.');
//         }
//     };

//     // Initialize Facebook SDK
//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Replace with your Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             window.FB.getLoginStatus((response) => {
//                 console.log('Initial login status check:', response);
//                 statusChangeCallback(response);
//             });
//         };

//         // Load the SDK
//         (function (d, s, id) {
//             if (d.getElementById(id)) return;
//             const js = d.createElement(s); js.id = id;
//             js.src = 'https://connect.facebook.net/en_US/sdk.js';
//             const fjs = d.getElementsByTagName(s)[0];
//             fjs.parentNode.insertBefore(js, fjs);
//         })(document, 'script', 'facebook-jssdk');
//     }, [statusChangeCallback]);

//     return (
//         <div>
//             <h1>Instagram Account Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithInstagram}>Login with Instagram</button>
//             )}

//             {isLoggedIn && instagramAccounts.length > 0 && (
//                 <div>
//                     <h2>Select an Instagram Account to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedInstagramId(e.target.value)}
//                         value={selectedInstagramId}
//                     >
//                         <option value="">Select Instagram Account</option>
//                         {instagramAccounts.map((account) => (
//                             <option key={account.id} value={account.id}>
//                                 {account.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your Instagram post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePostToInstagram}>Post to Instagram</button>
//                 </div>
//             )}

//             <button onClick={() => window.FB.getLoginStatus(statusChangeCallback)}>
//                 Re-check Login Status
//             </button>
//         </div>
//     );
// };

// export default InstagramLoginCheck;


// import React, { useState, useEffect, useCallback } from 'react';

// const InstagramLoginCheck = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [instagramAccounts, setInstagramAccounts] = useState([]);
//     const [selectedInstagramId, setSelectedInstagramId] = useState(null);
//     const [message, setMessage] = useState('');

//     const statusChangeCallback = useCallback((response) => {
//         if (response.status === 'connected') {
//             setIsLoggedIn(true);
//             fetchInstagramAccounts(response.authResponse.accessToken);
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     const fetchInstagramAccounts = (accessToken) => {
//         window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
//             if (response && !response.error) {
//                 console.log('Fetching pages response:', response); // Debug log
//                 const pagesWithInstagram = response.data.filter(page => page.instagram_business_account);
//                 setInstagramAccounts(pagesWithInstagram.map(page => ({
//                     id: page.instagram_business_account.id,
//                     name: page.name
//                 })));
//             } else {
//                 console.error('Error fetching Instagram accounts:', response.error);
//             }
//         });
//     };

//     const loginWithInstagram = () => {
//         window.FB.login(function (response) {
//             if (response.status === 'connected') {
//                 setIsLoggedIn(true);
//                 fetchInstagramAccounts(response.authResponse.accessToken);
//             } else {
//                 alert('Instagram login failed. Please try again.');
//             }
//         }, {
//             scope: 'instagram_basic, pages_show_list, instagram_content_publish',
//             config_id: '1273277580768760'
//         });
//     };

//     const handlePostToInstagram = async () => {
//         const selectedAccount = instagramAccounts.find(account => account.id === selectedInstagramId);
//         if (selectedAccount) {
//             const formData = new FormData();
//             formData.append('caption', message);
//             formData.append('accessToken', selectedAccount.access_token);
//             formData.append('instagramAccountId', selectedInstagramId);

//             try {
//                 const response = await fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
//                     method: 'POST',
//                     body: formData
//                 });

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 // Uncomment if you want to use result
//                 // const result = await response.json();
//                 // console.log('Upload result:', result); // Use this if needed
//             } catch (error) {
//                 console.error('Error posting to Instagram:', error);
//                 alert(`Error posting: ${error.message}`);
//             }
//         } else {
//             alert('Please select an Instagram account to post to.');
//         }
//     };

//     useEffect(() => {
//         window.fbAsyncInit = function () {
//             window.FB.init({
//                 appId: '1332019044439778', // Your Facebook App ID
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v20.0'
//             });

//             // eslint-disable-next-line react-hooks/exhaustive-deps
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
//             <h1>Instagram Account Manager</h1>

//             {!isLoggedIn && (
//                 <button onClick={loginWithInstagram}>Login with Instagram</button>
//             )}

//             {isLoggedIn && instagramAccounts.length > 0 && (
//                 <div>
//                     <h2>Select an Instagram Account to Post</h2>
//                     <select
//                         onChange={(e) => setSelectedInstagramId(e.target.value)}
//                         value={selectedInstagramId}
//                     >
//                         <option value="">Select Instagram Account</option>
//                         {instagramAccounts.map((account) => (
//                             <option key={account.id} value={account.id}>
//                                 {account.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Write your Instagram post"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     ></textarea>

//                     <button onClick={handlePostToInstagram}>Post to Instagram</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstagramLoginCheck;
import React, { useEffect, useState } from 'react';

const InstagramLoginCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pages, setPages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Load the Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({ // Use window.FB here
                appId: '<YOUR_APP_ID>', // Replace with your Facebook App ID
                cookie: true,
                xfbml: true,
                version: 'v12.0'
            });

            checkLoginStatus();
        };

        // Load the SDK script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Check login status function
        const checkLoginStatus = () => {
            window.FB.getLoginStatus(response => { // Use window.FB here
                console.log('Login Status:', response);
                if (response.status === 'connected') {
                    setIsLoggedIn(true);
                    fetchPages(response.authResponse.accessToken);
                } else {
                    setIsLoggedIn(false);
                }
            });
        };

        // Function to fetch pages
        const fetchPages = (accessToken) => {
            window.FB.api('/me/accounts', { access_token: accessToken }, response => { // Use window.FB here
                console.log('Fetching pages response:', response);
                if (response && !response.error) {
                    setPages(response.data);
                    if (response.data.length === 0) {
                        setErrorMessage('No Facebook pages found linked to your account.');
                    } else {
                        setErrorMessage('');
                    }
                } else {
                    console.error('Error fetching pages:', response.error);
                }
            });
        };

        // Check login status when the component mounts
        checkLoginStatus();
    }, []); // Empty dependency array to run once on mount

    const handleLogin = () => {
        window.FB.login(response => { // Use window.FB here
            console.log('FB Login Response:', response);
            if (response.authResponse) {
                setIsLoggedIn(true);
                // fetchPages(response.authResponse.accessToken);
            } else {
                console.error('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'public_profile,email,pages_show_list,instagram_basic,instagram_content_publish' });
    };

    return (
        <div>
            <h2>Instagram Login Check</h2>
            {!isLoggedIn ? (
                <button onClick={handleLogin}>Log in with Instagram</button>
            ) : (
                <div>
                    <p>Logged in!</p>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <h3>Pages:</h3>
                    <ul>
                        {pages.map(page => (
                            <li key={page.id}>
                                {page.name} (Category: {page.category})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default InstagramLoginCheck;
