import React, { useEffect, useState } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts from the backend
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts'); // Replace with your backend URL
                const data = await response.json();
                console.log('Fetched posts:', data); // Debug API response
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="posts-feed">
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <div className="post-header">
                        <h3>{post.pageName}</h3>
                        <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="post-content">
                        <p>{post.message}</p>
                        {post.media && Array.isArray(post.media) && post.media.map((mediaItem, index) => (
                            <img
                                key={index}
                                src={`https://graph.facebook.com/v21.0/${mediaItem.media_fbid}/picture?access_token=${post.accessToken}`}
                                alt="Media"
                            />
                        ))}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default TotalPosts;
