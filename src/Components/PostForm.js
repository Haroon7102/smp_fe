import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');

    // Function to get the JWT token from localStorage or any other source
    const getToken = () => localStorage.getItem('token');

    const handleFacebookPost = async () => {
        try {
            await axios.post('http://localhost:5000/post/post/facebook',
                { message },
                {
                    headers: {
                        'Authorization': `Bearer ${getToken()}` // Include the token
                    }
                }
            );
            alert('Posted to Facebook successfully!');
        } catch (error) {
            console.error('Error posting to Facebook:', error);
            alert('Failed to post on Facebook.');
        }
    };

    const handleInstagramPost = async () => {
        try {
            await axios.post('http://localhost:5000/post/post/instagram',
                { imageUrl, caption },
                {
                    headers: {
                        'Authorization': `Bearer ${getToken()}` // Include the token
                    }
                }
            );
            alert('Posted to Instagram successfully!');
        } catch (error) {
            console.error('Error posting to Instagram:', error);
            alert('Failed to post on Instagram.');
        }
    };

    return (
        <div>
            <h2>Post to Social Media</h2>
            <div>
                <textarea
                    placeholder="Write your message for Facebook..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleFacebookPost}>Post to Facebook</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Image URL for Instagram"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <textarea
                    placeholder="Write your caption for Instagram..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <button onClick={handleInstagramPost}>Post to Instagram</button>
            </div>
        </div>
    );
};

export default PostForm;
