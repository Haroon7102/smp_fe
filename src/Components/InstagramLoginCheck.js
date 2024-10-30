import React from 'react';

const InstagramLoginButton = () => {
    const instagramAuthURL = "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1199616704485910&redirect_uri=https://smpfe.netlify.app/auth/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";

    return (
        <a href={instagramAuthURL} className="btn btn-primary">
            Log in with Instagram
        </a>
    );
};

export default InstagramLoginButton;
