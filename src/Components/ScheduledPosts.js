import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduledPosts = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        id: null,
        caption: '',
        postType: '',
        files: [], // Renamed from 'file' to 'files' for clarity
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
                console.error('Error fetching posts:', error);
            });
    }, []);

    // Calculate time left until the post is due
    const calculateTimeLeft = (scheduledDate) => {
        const now = new Date(); // Current time
        console.log("Current time (now):", now.toISOString()); // For debugging

        // scheduledDate is assumed to be fetched from the database as a UTC string (ISO 8601 format)
        console.log("Scheduled Date (from DB):", scheduledDate); // For debugging

        // Parse both as UTC timestamps directly
        const nowTime = now.getTime(); // Get the current time in milliseconds since epoch
        const scheduledTime = Date.parse(scheduledDate); // Parse the DB string as UTC milliseconds since epoch

        // Compare the two times
        const timeDiff = scheduledTime - nowTime;
        console.log("Time Difference in ms:", timeDiff);

        if (timeDiff <= 0) {
            return "Post is already due";
        }

        const hours = Math.floor(timeDiff / 1000 / 60 / 60); // Get hours
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

        return `${hours} hours ${minutes} minutes left`;
    };

    // Handle updating the post
    const handleUpdate = (postId, existingCaption, existingPostType, existingFiles, existingScheduledDate, status) => {
        if (status.toLowerCase() !== 'scheduled') {
            alert('Scheduled date can only be updated for posts that are scheduled.');
            return;
        }
        setShowUpdateModal(true);
        setPostData({
            id: postId,
            caption: existingCaption,
            postType: existingPostType,
            files: existingFiles.map(file => ({ name: file.name, url: file.url })), // Map to maintain structure
            scheduledDate: new Date(existingScheduledDate).toISOString().slice(0, 16), // Format for datetime-local
        });
    };

    // Handle input field changes (caption, postType)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({ ...postData, [name]: value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setPostData({ ...postData, files: [...postData.files, ...newFiles] });
    };

    // Remove a file from the list
    const handleRemoveFile = (fileName) => {
        setPostData({
            ...postData,
            files: postData.files.filter(file => file.name !== fileName),
        });
    };

    // Handle scheduled date change
    const handleScheduledDateChange = (e) => {
        const { value } = e.target;
        setPostData({ ...postData, scheduledDate: value });
    };

    // Submit the updated post
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('caption', postData.caption);
        formData.append('postType', postData.postType);
        formData.append('scheduledDate', postData.scheduledDate);

        // Append files (new and existing files)
        postData.files.forEach((file) => {
            if (file.url) {
                // Existing file
                formData.append('existingFiles', file.name);
            } else {
                // New file
                formData.append('files', file, file.name);
            }
        });

        try {
            const response = await axios.put(`https://smp-be-mysql.vercel.app/scheduled/posts/${postData.id}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Post updated successfully:', response.data);
            setShowUpdateModal(false);
            // Refresh posts after update
            const updatedPosts = posts.map(post =>
                post.id === postData.id ? { ...post, ...response.data } : post
            );
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Delete post
    const handleDelete = (postId) => {
        axios.delete(`https://smp-be-mysql.vercel.app/scheduled/delete-scheduled-post/${postId}`)
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => {
                console.error('Error deleting post:', error);
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
                            <td>{post.scheduledDate}</td>
                            <td>{post.isScheduled ? 'Scheduled' : 'Published'}</td>
                            <td>{post.isScheduled ? calculateTimeLeft(post.scheduledDate) : 'Post is published'}</td>
                            <td>
                                {post.isScheduled && (
                                    <button onClick={() => handleUpdate(post.id, post.caption, post.postType, post.files || [], post.scheduledDate, 'scheduled')}>Update</button>
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

                        <div>
                            <label>Scheduled Date:</label>
                            <input
                                type="datetime-local"
                                name="scheduledDate"
                                value={postData.scheduledDate}
                                onChange={handleScheduledDateChange}
                            />
                        </div>

                        <div>
                            <label>Files:</label>
                            <div>
                                {postData.files.map((file, index) => (
                                    <div key={index} className="file-preview">
                                        {file.url || file.type?.startsWith('image/') ? (
                                            <img src={file.url || URL.createObjectURL(file)} alt={file.name} width="100" />
                                        ) : (
                                            <video width="100" controls>
                                                <source src={file.url || URL.createObjectURL(file)} type={file.type} />
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
