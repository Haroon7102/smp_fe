import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InstagramLoginButton = () => {
    const clientId = '1199616704485910';
    const redirectUri = 'https://smpfe.netlify.app/dashboard';
    const scope = 'instagram_business_basic,instagram_business_content_publish';
    const navigate = useNavigate();
    const location = useLocation();

    // Handle the redirection and code exchange after Instagram login
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code) {
            // Send the code to the backend for token exchange and post
            fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, redirect_uri: redirectUri })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Instagram post successful!');
                    } else {
                        alert('Error in posting to Instagram.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error in processing the Instagram login.');
                });
        }
    }, [location.search]);

    const handleLogin = () => {
        const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    return (
        <button onClick={handleLogin}>
            Login with Instagram
        </button>
    );
};

export default InstagramLoginButton;
