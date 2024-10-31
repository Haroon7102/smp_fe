// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const InstagramRedirectHandler = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if the URL has an Instagram authorization code
//         const urlParams = new URLSearchParams(window.location.search);
//         const authorizationCode = urlParams.get('code');

//         if (authorizationCode) {
//             // You can optionally send this code to your backend for further processing (e.g., exchanging it for an access token)

//             // Redirect to the dashboard after successful authorization
//             navigate('/dashboard');
//         }
//     }, [navigate]);

//     return <div>Redirecting...</div>;
// };

// export default InstagramRedirectHandler;
