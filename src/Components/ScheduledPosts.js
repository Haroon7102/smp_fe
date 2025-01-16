import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduledPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch scheduled posts when the component mounts
        axios.get('https://smp-be-mysql.vercel.app/facebook-upload/fetch-scheduled-posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const calculateTimeLeft = (scheduledDate) => {
        const now = new Date();
        const scheduledTime = new Date(scheduledDate);
        const timeDiff = scheduledTime - now;

        if (timeDiff <= 0) {
            return "Post is already due";
        }

        const hours = Math.floor(timeDiff / 1000 / 60 / 60);
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours} hours ${minutes} minutes left`;
    };

    const handleUpdate = (postId) => {
        // You can open an update form to modify the post data
        // You can send a PUT request to update the post
    };

    const handleDelete = (postId) => {
        axios.delete(`https://smp-be-mysql.vercel.app/facebook-upload/delete-scheduled-post/${postId}`)
            .then(response => {
                // Remove the deleted post from the list
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
                            <td>
                                {post.isScheduled ? "Scheduled" : "Published"}
                            </td>
                            <td>
                                {post.isScheduled ? calculateTimeLeft(post.scheduledDate) : "Post is published"}
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(post.id)}>Update</button>
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduledPosts;
