import React, { useState, useEffect } from "react";

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
    const [isUpdating, setIsUpdating] = useState(false);
    const [postToUpdate, setPostToUpdate] = useState(null);
    const [updatedCaption, setUpdatedCaption] = useState("");
    const [updatedMedia, setUpdatedMedia] = useState([]);

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

    const handleDelete = async (post) => {
        const { postId, pageId, accessToken, email } = post;

        try {
            const response = await fetch(
                "https://smp-be-mysql.vercel.app/facebook-upload/post/delete",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId,
                        pageId,
                        email,
                        accessToken,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Post deleted successfully.");
                setPosts(posts.filter((p) => p.postId !== postId));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to delete post.");
        }
    };

    const handleUpdate = (post) => {
        setIsUpdating(true);
        setPostToUpdate(post);
        setUpdatedCaption(post.message);

        // Ensure media is always an array, even if null or undefined
        setUpdatedMedia(post.media && post.media.length > 0 ? post.media : []);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUpdatedMedia([...updatedMedia, ...files]);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("pageId", postToUpdate.pageId);
        formData.append("postId", postToUpdate.postId);
        formData.append("caption", updatedCaption);
        formData.append("email", postToUpdate.email);
        formData.append("accessToken", postToUpdate.accessToken);

        if (postToUpdate.media && Array.isArray(postToUpdate.media)) {
            postToUpdate.media.forEach((mediaUrl) => {
                formData.append("existingMediaUrls", mediaUrl); // Send existing media URLs as part of the form data
            });
        }
        // Append files
        updatedMedia.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch(
                "https://smp-be-mysql.vercel.app/facebook-upload/post/update",
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Post updated successfully.");
                setPosts(posts.map((post) => (post.postId === postToUpdate.postId ? { ...post, caption: updatedCaption, media: updatedMedia } : post)));
                setIsUpdating(false);
            } else {
                alert("Error updating post.");
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Error updating post.");
        }
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
                                        <Media
                                            key={index}
                                            mediaUrl={mediaUrl}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : post.mediaUrl ? (
                                <div className="post-media">
                                    <Media mediaUrl={post.mediaUrl} index={0} />
                                </div>
                            ) : (
                                <p>No media available.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="post-actions">
                            {post.media &&
                                post.media.length > 0 &&
                                post.media.every((mediaUrl) => mediaUrl.includes(".mp4")) ? (
                                <button
                                    onClick={() => handleDelete(post)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleUpdate(post)}
                                        className="update-button"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}

            {/* Update Post Form */}
            {isUpdating && postToUpdate && (
                <div className="update-form">
                    <h3>Update Post</h3>
                    <form onSubmit={handleSubmitUpdate}>
                        <div>
                            <label>Caption:</label>
                            <textarea
                                value={updatedCaption}
                                onChange={(e) => setUpdatedCaption(e.target.value)}
                                rows="4"
                                placeholder="Update the caption..."
                            />
                        </div>
                        <div>
                            <label>Media:</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                            {updatedMedia.length > 0 && (
                                <div className="updated-media-preview">
                                    {updatedMedia.map((media, index) => (
                                        <div key={index}>
                                            {typeof media === "string" ? (
                                                <Media mediaUrl={media} index={index} />
                                            ) : (
                                                <img
                                                    src={URL.createObjectURL(media)}
                                                    alt={`New Media ${index}`}
                                                    style={{ maxWidth: "100%", margin: "10px 0", borderRadius: "8px" }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};


export default TotalPosts;
