import React, { useState, useEffect } from 'react';

const TotalPosts = () => {
    const [posts, setPosts] = useState([]); // Stores all posts
    const [totalPosts, setTotalPosts] = useState(0); // Total post count
    const [scheduledPosts, setScheduledPosts] = useState(0); // Scheduled post count
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch posts when the component mounts
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://smp-be-mysql.vercel.app/facebook-upload/posts'); // Replace with your actual API endpoint
            const data = await response.json();
            setPosts(data);
            setTotalPosts(data.length); // Total posts
            setScheduledPosts(data.filter(post => post.isScheduled).length); // Filter scheduled posts
            setLoading(false); // Data fetched
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Summary Section */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Total Posts: {totalPosts}</h2>
                <h3>Scheduled Posts: {scheduledPosts}</h3>
            </div>

            {/* Posts Section */}
            <div>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '15px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff',
                        }}
                    >
                        {/* Page Name */}
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '18px' }}>
                            {post.pageName}
                        </div>

                        {/* Timestamp */}
                        <div style={{ color: '#555', marginBottom: '10px', fontSize: '14px' }}>
                            Posted on: {new Date(post.createdAt).toLocaleString()}
                        </div>

                        {/* Caption */}
                        {post.message && (
                            <div style={{ marginBottom: '10px', fontSize: '16px' }}>{post.message}</div>
                        )}

                        {/* Media (Photos/Videos) */}
                        {post.media && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {post.media.map((mediaUrl, index) =>
                                    mediaUrl.endsWith('.mp4') ? (
                                        <video
                                            key={index}
                                            src={mediaUrl}
                                            controls
                                            style={{ width: '100%', maxWidth: '300px', borderRadius: '5px' }}
                                        ></video>
                                    ) : (
                                        <img
                                            key={index}
                                            src={mediaUrl}
                                            alt="Post Media"
                                            style={{ width: '100%', maxWidth: '300px', borderRadius: '5px' }}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalPosts;
