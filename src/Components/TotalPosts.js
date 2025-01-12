import React, { useEffect, useState } from "react";

// New Media component for handling image and video rendering
const Media = ({ mediaUrl, index }) => {
    const [isVideo, setIsVideo] = useState(false);
    const [isImage, setIsImage] = useState(false);

    useEffect(() => {
        if (mediaUrl.includes(".mp4")) {
            setIsVideo(true);
        } else {
            setIsImage(true);
        }
    }, [mediaUrl]);

    const handleVideoError = (e) => {
        e.target.style.display = "none";
        setIsImage(true);
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
                    style={{ maxWidth: "100%", margin: "10px 0", borderRadius: "8px" }}
                    onError={handleVideoError}
                >
                    Your browser does not support the video tag.
                </video>
            )}

            {isImage && (
                <img
                    src={mediaUrl}
                    alt={`Media ${index + 1}`}
                    style={{ maxWidth: "100%", margin: "10px 0", borderRadius: "8px" }}
                    onError={handleImageError}
                />
            )}
        </div>
    );
};

const TotalPosts = () => {
    const [posts, setPosts] = useState([]);

    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    "https://smp-be-mysql.vercel.app/facebook-upload/posts"
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    console.log("Fetched Posts:", data);
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

    // Delete post handler
    const handleDelete = async (post) => {
        // Explicitly extract fields and log the post object for debugging
        console.log("Post object received in handleDelete:", post);

        // const postId = post.postId; // Use the correct field explicitly
        const { postId, pageId, accessToken, email } = post;

        // Validate required fields
        if (!postId || !pageId || !accessToken || !email) {
            alert("Required data missing. Cannot delete post.");
            console.error("Missing fields:", { postId, pageId, accessToken, email });
            return;
        }

        try {
            // Send DELETE request
            const response = await fetch(
                "https://smp-be-mysql.vercel.app/facebook-upload/post/delete",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId,       // Use explicitly extracted postId
                        pageId,       // Use explicitly extracted pageId
                        email,        // Use explicitly extracted email
                        accessToken,  // Use explicitly extracted accessToken
                    }),
                }
            );

            const data = await response.json();

            // Check success response
            if (data.success) {
                alert("Post deleted successfully.");
                // Remove the deleted post from the frontend state
                setPosts(posts.filter((p) => p.postId !== postId));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to delete post.");
        }
    };



    // Update post handler (placeholder for now)
    const handleUpdate = (postId) => {
        alert(`Update post functionality for ID: ${postId} is not implemented yet.`);
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
                                        <Media key={index} mediaUrl={mediaUrl} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <p>No media available.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="post-actions">
                            <button
                                onClick={() => handleUpdate(post.id)}
                                className="update-button"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(post)} // Pass the entire post object
                                className="delete-button"
                            >
                                Delete
                            </button>
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
