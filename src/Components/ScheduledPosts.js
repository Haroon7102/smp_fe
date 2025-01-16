import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduledPosts = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        id: null,
        caption: '',
        postType: '',
        files: [],
    });
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        // Fetch scheduled posts when the component mounts
        axios.get('https://smp-be-mysql.vercel.app/scheduled/fetch-scheduled-posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const calculateTimeLeft = (scheduledDate) => {
        const now = new Date(); // Current time in local timezone
        const scheduledTime = new Date(scheduledDate); // Scheduled time from the database
        const timeDiff = scheduledTime.getTime() - now.getTime(); // Compare time in milliseconds

        if (timeDiff <= 0) {
            return "Post is already due";
        }

        const hours = Math.floor(timeDiff / 1000 / 60 / 60); // Get hours
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

        return `${hours} hours ${minutes} minutes left`;
    };

    const handleUpdate = (postId, existingCaption, existingPostType, existingFiles) => {
        // Open the update form (modal or form)
        setShowUpdateModal(true);

        // Set the existing post data in the form
        setPostData({
            id: postId,
            caption: existingCaption,
            postType: existingPostType,
            files: existingFiles || [], // Existing files
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({
            ...postData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setPostData({
            ...postData,
            files: [...postData.files, ...newFiles], // Add new files to existing ones
        });
    };

    const handleRemoveFile = (fileName) => {
        setPostData({
            ...postData,
            files: postData.files.filter((file) => file.name !== fileName),
        });
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        // Prepare FormData for the PUT request
        const formData = new FormData();
        formData.append('caption', postData.caption);
        formData.append('postType', postData.postType);

        // Add files (both existing and newly added)
        postData.files.forEach((file) => {
            formData.append('files', file, file.name);
        });

        try {
            const response = await axios.put(`https://smp-be-mysql.vercel.app/scheduled/posts/${postData.id}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Post updated successfully:', response.data);
            // Close the modal after success
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

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
                                <button onClick={() => handleUpdate(post.id, post.caption, post.postType, post.files)}>Update</button>
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for updating post */}
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

                        <div>
                            <label>Files:</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                            <ul>
                                {(Array.isArray(postData.files) ? postData.files : []).map((file) => (
                                    <li key={file.name}>
                                        {file.name}
                                        <button type="button" onClick={() => handleRemoveFile(file.name)}>
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
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
