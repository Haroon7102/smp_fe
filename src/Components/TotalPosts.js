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

    const renderMedia = (mediaUrl, index) => {
        return (
            <div key={index} className="media-container">
                {/* Try rendering as video first */}
                <video
                    src={mediaUrl}
                    controls
                    style={{
                        maxWidth: "100%",
                        margin: "10px 0",
                        borderRadius: "8px",
                    }}
                    onError={(e) => {
                        // If video fails to load, fallback to image
                        e.target.style.display = "none";
                        const fallbackImg = e.target.nextSibling;
                        if (fallbackImg) {
                            fallbackImg.style.display = "block";
                        }
                    }}
                >
                    Your browser does not support the video tag.
                </video>

                {/* Image fallback */}
                <img
                    src={mediaUrl}
                    alt={`Media ${index + 1}`}
                    style={{
                        maxWidth: "100%",
                        margin: "10px 0",
                        borderRadius: "8px",
                        display: "none", // Initially hide the image
                    }}
                    onError={(e) => {
                        console.error("Failed to load media:", e.target.src);
                        e.target.src = "https://via.placeholder.com/150"; // Fallback placeholder
                        e.target.style.display = "block"; // Ensure the placeholder is shown
                    }}
                />
            </div>
        );
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
                                    {post.media.map((mediaUrl, index) =>
                                        renderMedia(mediaUrl, index)
                                    )}
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
