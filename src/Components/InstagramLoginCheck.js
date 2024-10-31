// import React from 'react';

// const InstagramLoginButton = () => {
//     const instagramAuthURL = "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1199616704485910&redirect_uri=https://smpfe.netlify.app/instagram-upload/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";

//     return (
//         <a href={instagramAuthURL} className="btn btn-primary">
//             Log in with Instagram
//         </a>
//     );
// };

// export default InstagramLoginButton;

// import React, { useState } from 'react';

// const InstagramLoginButton = () => {
//     const [isThrottled, setIsThrottled] = useState(false);

//     const instagramAuthURL = "https://www.instagram.com/oauth/authorize?enable_fb_login=0&client_id=1199616704485910&redirect_uri=https://smpfe.netlify.app/instagram-upload/callback&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish";

//     const handleLoginClick = () => {
//         if (!isThrottled) {
//             setIsThrottled(true);
//             window.location.href = instagramAuthURL;

//             // Set a timer to reset throttling after 30 seconds
//             setTimeout(() => {
//                 setIsThrottled(false);
//             }, 30000); // 30 seconds
//         } else {
//             alert("Please wait before trying again.");
//         }
//     };

//     return (
//         <button className="btn btn-primary" onClick={handleLoginClick} disabled={isThrottled}>
//             Log in with Instagram
//         </button>
//     );
// };

// export default InstagramLoginButton;
