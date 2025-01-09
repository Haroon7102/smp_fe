import React, { useEffect, useState } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts');
                const data = await response.json();

                if (Array.isArray(data)) {
                    const processedPosts = data.map((post) => {
                        return { ...post };
                    });
                    setPosts(processedPosts);
                } else {
                    console.error('Invalid response format or error fetching posts:', data.error);
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="posts-feed">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        {/* Post Header */}
                        <div className="post-header">
                            <h3>{post.pageName || 'Page Name'}</h3>
                            <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Post Content */}
                        <div className="post-content">
                            {/* Message/Caption */}
                            <p>{post.message || 'No caption provided.'}</p>

                            {/* Media */}
                            {post.media && Array.isArray(post.media) && post.media.length > 0 ? (
                                <div className="post-media">
                                    {post.media.map((mediaItem, index) => {
                                        console.log("Media URL:", mediaItem.url); // Log the URL to check if it's valid
                                        return (
                                            <div key={index}>
                                                {mediaItem.type === 'video' && mediaItem.url ? (
                                                    <video
                                                        controls
                                                        src={mediaItem.url} // Use media URL from the database
                                                        onError={(e) => {
                                                            console.error("Failed to load video:", e.target.src);
                                                        }}
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <img
                                                        src={mediaItem.url || "placeholder-image-url.png"} // Use media URL from the database
                                                        alt="Facebook media"
                                                        onError={(e) => {
                                                            console.error("Failed to load image:", e.target.src);
                                                            e.target.src = "fallback-image-url.png"; // Optional fallback image
                                                        }}
                                                        style={{ maxWidth: "100%", height: "auto" }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
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
