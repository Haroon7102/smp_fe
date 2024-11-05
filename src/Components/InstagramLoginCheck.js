// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const InstagramLoginButton = () => {
//     const clientId = '1199616704485910';
//     const redirectUri = 'https://smpfe.netlify.app/dashboard';
//     const scope = 'instagram_business_basic,instagram_business_content_publish';
//     const location = useLocation();

//     // Handle the redirection and code exchange after Instagram login
//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         const code = urlParams.get('code');

//         if (code) {
//             // Alert user of successful login before initiating post request
//             alert('Successfully logged in with Instagram!');
//             // Send the code to the backend for token exchange and post
//             fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ code, redirect_uri: redirectUri })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         alert('Instagram post successful!');
//                     } else {
//                         alert('Error in posting to Instagram.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('Error in processing the Instagram login.');
//                 });
//         }
//     }, [location.search]);

//     const handleLogin = () => {
//         const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
//         window.location.href = authUrl;
//     };

//     return (
//         <button onClick={handleLogin}>
//             Login with Instagram
//         </button>
//     );
// };

// export default InstagramLoginButton;



import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const InstagramLoginButton = () => {
    const clientId = '1199616704485910';
    const redirectUri = 'https://smpfe.netlify.app/dashboard';
    const scope = 'instagram_business_basic,instagram_business_content_publish';
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    // Handle the redirection and code exchange after Instagram login
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code) {
            console.log('Authorization code received:', code);

            // Confirm successful login and hide login button
            alert('Successfully logged in with Instagram!');
            setIsLoggedIn(true);

            // Send the code to the backend for token exchange
            fetch('https://smp-be-mysql.vercel.app/instagram-upload/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }) // Send as JSON
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Backend response for token exchange:', data);

                    if (data.success) {
                        console.log('Token exchange successful.');
                    } else {
                        alert('Error in posting to Instagram.');
                        console.error('Token exchange error:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error in processing the Instagram login:', error);
                    alert('Error in processing the Instagram login.');
                });
        }
    }, [location.search]);

    const handleLogin = () => {
        const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
        console.log('Redirecting to Instagram auth URL:', authUrl);
        window.location.href = authUrl;
    };

    const handlePost = () => {
        if (!image) {
            alert('Please select an image.');
            return;
        }

        // Create a FormData object to send the caption and image file
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', image);

        console.log('Sending post request with caption and image to backend.');

        fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Backend response for Instagram post:', data);

                if (data.success) {
                    alert('Instagram post successful!');
                } else {
                    alert('Error in posting to Instagram.');
                    console.error('Post error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error in posting to Instagram:', error);
                alert('Error in posting to Instagram.');
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log('Image selected:', file);
        setImage(file);
    };

    return (
        <div>
            {!isLoggedIn ? (
                <button onClick={handleLogin}>Login with Instagram</button>
            ) : (
                <div>
                    <h3>Post to Instagram</h3>
                    <input
                        type="text"
                        placeholder="Enter caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button onClick={handlePost}>Post to Instagram</button>
                </div>
            )}
        </div>
    );
};

export default InstagramLoginButton;






// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const InstagramLoginButton = () => {
//     const clientId = '1199616704485910';
//     const redirectUri = 'https://smpfe.netlify.app/dashboard';
//     const scope = 'instagram_business_basic,instagram_business_content_publish';
//     const location = useLocation();

//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [caption, setCaption] = useState('');
//     const [image, setImage] = useState(null);
//     const [code, setCode] = useState(null);

//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         const retrievedCode = urlParams.get('code');

//         // Check if there's a code in the URL
//         if (retrievedCode) {
//             setCode(retrievedCode); // Store the code

//             // Send the code to the backend for token exchange
//             fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ code: retrievedCode, redirect_uri: redirectUri })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setIsLoggedIn(true);
//                         alert('Successfully logged in with Instagram!'); // Notify the user
//                     } else {
//                         console.error('Error in token exchange:', data.error); // Log specific error
//                         alert('Error in token exchange: ' + data.message);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Token Exchange Error:', error);
//                     alert('Error in processing the Instagram login: ' + error.message);
//                 });
//         } else {
//             // Check if user is already logged in (you may need to implement this based on your app logic)
//             // This could be through a session or stored token
//             const isUserLoggedIn = sessionStorage.getItem('instagramLoggedIn'); // Example of checking login status
//             if (isUserLoggedIn) {
//                 setIsLoggedIn(true);
//             }
//         }
//     }, [location.search]);

//     const handleLogin = () => {
//         const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
//         window.location.href = authUrl;
//     };

//     const handlePost = () => {
//         if (!image || !caption) {
//             alert('Please enter a caption and select an image.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('caption', caption);
//         formData.append('image', image);
//         formData.append('code', code); // Add the code

//         fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
//             method: 'POST',
//             body: formData
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     alert('Instagram post successful!');
//                 } else {
//                     console.error('Error in posting to Instagram:', data.error); // Log specific error
//                     alert('Error in posting to Instagram: ' + data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error('Post Error:', error);
//                 alert('Error in posting to Instagram: ' + error.message);
//             });
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     return (
//         <div>
//             {!isLoggedIn ? (
//                 <button onClick={handleLogin}>Login with Instagram</button>
//             ) : (
//                 <div>
//                     <h3>Post to Instagram</h3>
//                     <input
//                         type="text"
//                         placeholder="Enter caption"
//                         value={caption}
//                         onChange={(e) => setCaption(e.target.value)}
//                     />
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     />
//                     <button onClick={handlePost} disabled={!image || !caption}>
//                         Post to Instagram
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstagramLoginButton;
