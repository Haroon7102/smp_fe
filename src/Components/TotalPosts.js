import React, { useEffect, useState } from "react";

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    "https://smp-be-mysql.vercel.app/facebook-upload/posts"
                );
                const data = await response.json();

                console.log("Fetched posts:", data); // Debug fetched data
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("Invalid response format:", data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const isImage = (url) => {
        // Check if URL ends with typical image file extensions
        return /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(url);
    };

    const isVideo = (url) => {
        // Check if URL ends with typical video file extensions
        return /\.(mp4|mov|webm|ogg)$/i.test(url);
    };

    return (
        <div className="posts-feed">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        {/* Post Header */}
                        <div className="post-header">
                            <h3>{post.pageName || "Page Name"}</h3>
                            <p className="post-time">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* Post Content */}
                        <div className="post-content">
                            <p>{post.message || "No caption provided."}</p>

                            {/* Media */}
                            {post.media && post.media.length > 0 ? (
                                <div className="post-media">
                                    {post.media.map((mediaUrl, index) => (
                                        isImage(mediaUrl) ? (
                                            <img
                                                key={index}
                                                src={mediaUrl}
                                                alt={`Media ${index + 1}`}
                                                onError={(e) => {
                                                    console.error(
                                                        "Failed to load image:",
                                                        e.target.src
                                                    );
                                                    e.target.src =
                                                        "https://via.placeholder.com/150"; // Fallback placeholder
                                                }}
                                                style={{
                                                    maxWidth: "100%",
                                                    margin: "10px 0",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        ) : isVideo(mediaUrl) ? (
                                            <video
                                                key={index}
                                                src={mediaUrl}
                                                controls
                                                style={{
                                                    maxWidth: "100%",
                                                    margin: "10px 0",
                                                    borderRadius: "8px",
                                                }}
                                                onError={(e) => {
                                                    console.error(
                                                        "Failed to load video:",
                                                        e.target.src
                                                    );
                                                }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <p key={index}>Unsupported media format.</p>
                                        )
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
