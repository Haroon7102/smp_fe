import React, { useEffect, useState } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    // Function to fetch video source URL
    const fetchVideoSource = async (mediaFbid, accessToken) => {
        try {
            const response = await fetch(
                `https://graph.facebook.com/v21.0/${mediaFbid}?fields=source&access_token=${accessToken}`
            );
            const data = await response.json();

            if (data && data.source) {
                return data.source; // Return the video source URL
            } else {
                console.error(`No source found for video with media_fbid: ${mediaFbid}`, data);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching video source for media_fbid ${mediaFbid}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts');
                const data = await response.json();

                if (Array.isArray(data)) {
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
                                        } else if (mediaItem.type === 'photo') {
                                            return { ...mediaItem }; // Photos don't need extra processing
                                        }
                                        return null; // Handle unknown media types gracefully
                                    })
                                );
                                return { ...post, media: updatedMedia.filter(Boolean) }; // Filter out null values
                            }
                            return post;
                        })
                    );
                    setPosts(processedPosts);
                } else {
                    console.error('Error fetching posts:', data.error);
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
                            {post.media && post.media.length > 0 ? (
                                <div className="post-media">
                                    {post.media.map((mediaItem, index) => (
                                        <div key={index} className="media-item" style={{ marginBottom: '10px' }}>
                                            {mediaItem.type === 'video' && mediaItem.source ? (
                                                <video
                                                    controls
                                                    src={mediaItem.source}
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : mediaItem.type === 'photo' ? (
                                                <img
                                                    src={`https://graph.facebook.com/v21.0/${mediaItem.media_fbid}/picture?access_token=${post.accessToken}`}
                                                    alt={post.message || 'Facebook media'}
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            ) : (
                                                <p>Unsupported media type.</p>
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
