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
                            {post.media && Array.isArray(post.media) && post.media.length > 0 ? (
                                <div className="post-media">
                                    {post.media.map((mediaItem, index) => (
                                        <div key={index}>
                                            {mediaItem.type === "video" ? (
                                                <video
                                                    controls
                                                    src={mediaItem.url}
                                                    onError={(e) => {
                                                        console.error(
                                                            "Failed to load video:",
                                                            e.target.src
                                                        );
                                                    }}
                                                    style={{
                                                        maxWidth: "100%",
                                                        height: "auto",
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={mediaItem.url}
                                                    alt="Media"
                                                    onError={(e) => {
                                                        console.error(
                                                            "Failed to load image:",
                                                            e.target.src
                                                        );
                                                    }}
                                                    style={{
                                                        maxWidth: "100%",
                                                        height: "auto",
                                                    }}
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
