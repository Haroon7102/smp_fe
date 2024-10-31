// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CallbackPage = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Extract access token from URL parameters
//         const urlParams = new URLSearchParams(window.location.search);
//         const accessToken = urlParams.get('access_token');

//         if (accessToken) {
//             // Store access token in local storage or context for later use
//             localStorage.setItem('instagram_access_token', accessToken);

//             // Redirect to the main dashboard page
//             navigate('/dashboard');
//         } else {
//             // Handle case where access token is not found
//             console.error('No access token found');
//         }
//     }, [navigate]);

//     return <div>Redirecting...</div>;
// };

// export default CallbackPage;
