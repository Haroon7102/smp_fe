import React, { useEffect, useState } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    const fetchVideoSource = async (mediaFbid, accessToken) => {
        try {
            const response = await fetch(
                `https://graph.facebook.com/v21.0/${mediaFbid}?fields=source&access_token=${accessToken}`
            );
            const data = await response.json();
            return data.source; // Return the source URL of the video
        } catch (error) {
            console.error(`Error fetching video source for media_fbid ${mediaFbid}:`, error);
            return null; // Return null if there's an error
        }
    };

    useEffect(() => {
        // Fetch posts from the backend
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts');
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Process posts to fetch video sources for any videos
                    const processedPosts = await Promise.all(
                        data.map(async (post) => {
                            if (post.media && Array.isArray(post.media)) {
                                const updatedMedia = await Promise.all(
                                    post.media.map(async (mediaItem) => {
                                        if (mediaItem.type === 'video') {
                                            const videoSource = await fetchVideoSource(
                                                mediaItem.media_fbid,
                                                post.accessToken
                                            );
                                            return { ...mediaItem, source: videoSource };
                                        }
                                        return mediaItem; // Return photos as is
                                    })
                                );
                                return { ...post, media: updatedMedia };
                            }
                            return post;
                        })
                    );
                    setPosts(processedPosts);
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
                posts.map((post) => (
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
                                            {mediaItem.type === 'video' && mediaItem.source ? (
                                                <video
                                                    controls
                                                    src={mediaItem.source}
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
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
