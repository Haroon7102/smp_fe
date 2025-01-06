import React, { useEffect, useState } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts from the backend
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error('Error fetching posts:', data.error);
                    setPosts([]); // Set to an empty array to avoid crashing
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]); // Handle fetch errors gracefully
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="posts-feed">
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.id} className="post-card">
                        {/* Post Header */}
                        <div className="post-header">
                            <h3>{post.pageName}</h3>
                            <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Post Content */}
                        <div className="post-content">
                            {/* Message/Caption */}
                            <p>{post.message || 'No caption provided.'}</p>

                            {/* Media */}
                            {post.media && Array.isArray(post.media) && post.media.length > 0 ? (
                                <div className="post-media">
                                    {post.media.map((mediaItem, index) => (
                                        <div key={index}>
                                            {mediaItem.type === 'video' ? (
                                                <video
                                                    controls
                                                    src={`https://graph.facebook.com/v21.0/${mediaItem.media_fbid}/videos?access_token=${post.accessToken}`}
                                                    alt="Video Media"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            ) : (
                                                <img
                                                    src={`https://graph.facebook.com/v21.0/${mediaItem.media_fbid}/picture?access_token=${post.accessToken}`}
                                                    alt={post.message || 'Facebook media'} // Use a meaningful description or the post's message
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />

                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No media available.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
};

export default TotalPosts;
