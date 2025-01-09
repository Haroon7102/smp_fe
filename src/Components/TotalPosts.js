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
        const [isVideo, setIsVideo] = useState(false);
        const [isImage, setIsImage] = useState(false);

        useEffect(() => {
            // Check the URL to identify if it is a video or image
            if (mediaUrl.includes(".mp4")) {
                setIsVideo(true);
            } else {
                setIsImage(true);
            }
        }, [mediaUrl]);

        const handleVideoError = (e) => {
            e.target.style.display = "none";
            setIsImage(true); // Show image fallback
        };

        const handleImageError = (e) => {
            e.target.style.display = "none";
            console.error("Failed to load media:", e.target.src);
        };

        return (
            <div key={index} className="media-container">
                {isVideo && (
                    <video
                        src={mediaUrl}
                        controls
                        style={{
                            maxWidth: "100%",
                            margin: "10px 0",
                            borderRadius: "8px",
                        }}
                        onError={handleVideoError}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}

                {isImage && (
                    <img
                        src={mediaUrl}
                        alt={`Media ${index + 1}`}
                        style={{
                            maxWidth: "100%",
                            margin: "10px 0",
                            borderRadius: "8px",
                        }}
                        onError={handleImageError}
                    />
                )}
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
