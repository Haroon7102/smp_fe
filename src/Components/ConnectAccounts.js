import React from 'react';

// Function to redirect to Facebook OAuth
const connectFacebook = () => {
    const appId = '1181556439761653'; // Replace with your Facebook App ID
    const redirectUri = 'http://localhost:3000/auth/callback'; // Replace with your redirect URI
    const stateParam = 'some-random-string'; // Optional state parameter for security
    const scope = 'pages_manage_posts,publish_to_groups,publish_pages'; // Add required permissions

    // Construct the OAuth URL for Facebook
    const oauthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${stateParam}&scope=${scope}`;

    // Redirect the user to the Facebook OAuth login
    window.location.href = oauthUrl;
};

// Function to redirect to Instagram OAuth
const connectInstagram = () => {
    const clientId = '481691351358779'; // Replace with your Instagram Client ID
    const redirectUri = 'http://localhost:3000/auth/callback'; // Replace with your redirect URI
    const stateParam = 'some-random-string'; // Optional state parameter for security
    const scope = 'user_profile,user_media'; // Adjust scopes as per your requirements

    // Construct the OAuth URL for Instagram
    const oauthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${stateParam}&scope=${scope}&response_type=code`;

    // Redirect the user to the Instagram OAuth login
    window.location.href = oauthUrl;
};

const ConnectAccounts = () => {
    return (
        <div>
            <h2>Connect Your Social Media Accounts</h2>
            <button onClick={connectFacebook}>Connect Facebook</button>
            <button onClick={connectInstagram}>Connect Instagram</button>
        </div>
    );
};

export default ConnectAccounts;
