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
                            {post.media ? (
                                <div className="post-media">
                                    <RenderMedia media={post.media} />
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

// Helper Component to Render Media
const RenderMedia = ({ media }) => {
    // Ensure media is in array format
    const mediaArray = Array.isArray(media) ? media : [media];

    return (
        <>
            {mediaArray.map((mediaItem, index) => {
                const mediaUrl = mediaItem.url; // Media URL from backend
                const mediaType = mediaItem.type; // Media type ('image' or 'video')

                if (mediaType === "video") {
                    return (
                        <video
                            key={index}
                            controls
                            src={mediaUrl}
                            onError={(e) => {
                                console.error("Failed to load video:", e.target.src);
                            }}
                            style={{ maxWidth: "100%", height: "auto" }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    );
                } else {
                    return (
                        <img
                            key={index}
                            src={mediaUrl}
                            alt="Media"
                            onError={(e) => {
                                console.error("Failed to load image:", e.target.src);
                                e.target.src = "https://via.placeholder.com/150"; // Fallback placeholder
                            }}
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    );
                }
            })}
        </>
    );
};

export default TotalPosts;
