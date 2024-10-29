import React, { useState, useEffect, useCallback } from 'react';

const InstagramLoginCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const [selectedInstagramId, setSelectedInstagramId] = useState(null);
    const [message, setMessage] = useState('');

    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            setIsLoggedIn(true);
            fetchInstagramAccounts(response.authResponse.accessToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchInstagramAccounts = (accessToken) => {
        // Fetch Facebook pages and corresponding Instagram business accounts
        window.FB.api('/me/accounts', { access_token: accessToken }, function (response) {
            if (response && !response.error) {
                // Get pages with linked Instagram accounts
                const pagesWithInstagram = response.data.filter(page => page.instagram_business_account);
                setInstagramAccounts(pagesWithInstagram.map(page => ({
                    id: page.instagram_business_account.id,
                    name: page.name
                })));
            } else {
                console.error('Error fetching Instagram accounts:', response.error);
            }
        });
    };

    const loginWithInstagram = () => {
        window.FB.login(function (response) {
            if (response.status === 'connected') {
                setIsLoggedIn(true);
                fetchInstagramAccounts(response.authResponse.accessToken);
            } else {
                alert('Instagram login failed. Please try again.');
            }
        }, {
            scope: 'instagram_basic, pages_show_list, instagram_content_publish',
            config_id: '1273277580768760'
        });
    };

    const handlePostToInstagram = async () => {
        const selectedAccount = instagramAccounts.find(account => account.id === selectedInstagramId);
        if (selectedAccount) {
            const formData = new FormData();
            formData.append('caption', message);
            formData.append('accessToken', selectedAccount.access_token);
            formData.append('instagramAccountId', selectedInstagramId);

            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/instagram-upload/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Upload result:', result);
            } catch (error) {
                console.error('Error posting to Instagram:', error);
                alert(`Error posting: ${error.message}`);
            }
        } else {
            alert('Please select an Instagram account to post to.');
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
            <h1>Instagram Account Manager</h1>

            {!isLoggedIn && (
                <button onClick={loginWithInstagram}>Login with Instagram</button>
            )}

            {isLoggedIn && instagramAccounts.length > 0 && (
                <div>
                    <h2>Select an Instagram Account to Post</h2>
                    <select
                        onChange={(e) => setSelectedInstagramId(e.target.value)}
                        value={selectedInstagramId}
                    >
                        <option value="">Select Instagram Account</option>
                        {instagramAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Write your Instagram post"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <button onClick={handlePostToInstagram}>Post to Instagram</button>
                </div>
            )}
        </div>
    );
};

export default InstagramLoginCheck;
