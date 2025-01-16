import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduledPosts = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        id: null,
        caption: '',
        postType: '',
        file: [],
        scheduledDate: '',
    });
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Fetch scheduled posts
    useEffect(() => {
        axios.get('https://smp-be-mysql.vercel.app/scheduled/fetch-scheduled-posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    // Calculate time left until the post is due
    const calculateTimeLeft = (scheduledDate) => {
        console.log("sechudled date from database is:", scheduledDate);
        const now = new Date(); // Current time in local timezone
        const scheduledTime = new Date(scheduledDate); // Convert to Date object

        // If you want to handle the timezone explicitly:

        const timeDiff = scheduledTime.getTime() - now.getTime(); // Compare time in milliseconds

        if (timeDiff <= 0) {
            return "Post is already due";
        }

        const hours = Math.floor(timeDiff / 1000 / 60 / 60); // Get hours
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

        return `${hours} hours ${minutes} minutes left`;
    };

    // Handle updating the post
    const handleUpdate = (postId, existingCaption, existingPostType, existingFiles, existingScheduledDate, status) => {
        if (!status || status.toLowerCase() !== "scheduled") {
            alert("Scheduled date can only be updated for posts that are scheduled.");
            return;
        }
        setShowUpdateModal(true);

        setPostData({
            id: postId,
            caption: existingCaption,
            postType: existingPostType,
            file: existingFiles,
            scheduledDate: existingScheduledDate,
        });
    };

    // Handle input field changes (caption, postType)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({
            ...postData,
            [name]: value,
        });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setPostData({
            ...postData,
            file: [...postData.files, ...newFiles],
        });
    };

    // Remove a file from the list
    const handleRemoveFile = (fileName) => {
        setPostData({
            ...postData,
            files: postData.file.filter((file) => file.name !== fileName),
        });
    };

    // Handle scheduled date change
    const handleScheduledDateChange = (e) => {
        const { value } = e.target;
        setPostData({
            ...postData,
            scheduledDate: value,
        });
    };

    // Submit the updated post
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('caption', postData.caption);
        formData.append('postType', postData.postType);
        formData.append('scheduledDate', postData.scheduledDate);

        // Append files (new and existing files)
        postData.file.forEach((file) => {
            formData.append('files', file, file.name);
        });

        try {
            const response = await axios.put(`https://smp-be-mysql.vercel.app/scheduled/posts/${postData.id}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Post updated successfully:', response.data);
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Delete post
    const handleDelete = (postId) => {
        axios.delete(`https://smp-be-mysql.vercel.app/scheduled/delete-scheduled-post/${postId}`)
            .then(response => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => {
                console.error("Error deleting post:", error);
            });
    };

    return (
        <div>
            <h1>Scheduled Posts</h1>
            <table>
                <thead>
                    <tr>
                        <th>Caption</th>
                        <th>Scheduled Date</th>
                        <th>Status</th>
                        <th>Time Left</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.caption}</td>
                            <td>{new Date(post.scheduledDate).toLocaleString()}</td>
                            <td>{post.isScheduled ? "Scheduled" : "Published"}</td>
                            <td>{post.isScheduled ? calculateTimeLeft(post.scheduledDate) : "Post is published"}</td>
                            <td>
                                {post.isScheduled && (
                                    <button onClick={() => handleUpdate(post.id, post.caption, post.postType, post.files, post.scheduledDate, post.status)}>Update</button>
                                )}
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="update-modal">
                    <h2>Update Post</h2>
                    <form onSubmit={handleSubmitUpdate}>
                        <div>
                            <label>Caption:</label>
                            <input
                                type="text"
                                name="caption"
                                value={postData.caption}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Post Type:</label>
                            <select
                                name="postType"
                                value={postData.postType}
                                onChange={handleChange}
                            >
                                <option value="feed">Feed</option>
                                <option value="story">Story</option>
                            </select>
                        </div>

                        {/* Only allow scheduled date change if post is scheduled */}
                        {postData.scheduledDate && (
                            <div>
                                <label>Scheduled Date:</label>
                                <input
                                    type="datetime-local"
                                    name="scheduledDate"
                                    value={postData.scheduledDate}
                                    onChange={handleScheduledDateChange}
                                    disabled={postData.status !== "scheduled"}
                                />
                            </div>
                        )}

                        {/* Display existing files */}
                        <div>
                            <label>Files:</label>
                            <div>
                                {postData.files && postData.files.map((file, index) => (
                                    <div key={index} className="file-preview">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt={file.name} width="100" />
                                        ) : (
                                            <video width="100" controls>
                                                <source src={URL.createObjectURL(file)} type={file.type} />
                                            </video>
                                        )}
                                        <button type="button" onClick={() => handleRemoveFile(file.name)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type="submit">Update Post</button>
                    </form>
                    <button onClick={() => setShowUpdateModal(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ScheduledPosts;
