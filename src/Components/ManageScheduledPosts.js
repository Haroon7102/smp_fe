import React, { useState } from 'react';
import './ManageScheduledPosts.css';

const ManageScheduledPosts = () => {
    // Sample data for scheduled posts
    const [scheduledPosts, setScheduledPosts] = useState([
        {
            id: 1,
            content: 'Scheduled post content 1',
            platforms: ['Facebook', 'Twitter'],
            scheduledTime: '2024-08-30 10:00 AM'
        },
        {
            id: 2,
            content: 'Scheduled post content 2',
            platforms: ['Instagram'],
            scheduledTime: '2024-09-01 02:00 PM'
        }
    ]);

    const handleEdit = (id) => {
        alert(`Edit post with ID: ${id}`);
        // Logic for editing the post can go here
    };

    const handleDelete = (id) => {
        setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    };

    return (
        <div className="scheduled-posts-container">
            <h1>Manage Scheduled Posts</h1>
            {scheduledPosts.length > 0 ? (
                <ul>
                    {scheduledPosts.map(post => (
                        <li key={post.id} className="scheduled-post-item">
                            <div className="post-details">
                                <p><strong>Content:</strong> {post.content}</p>
                                <p><strong>Platforms:</strong> {post.platforms.join(', ')}</p>
                                <p><strong>Scheduled Time:</strong> {post.scheduledTime}</p>
                            </div>
                            <div className="post-actions">
                                <button className="edit-btn" onClick={() => handleEdit(post.id)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No scheduled posts available.</p>
            )}
        </div>
    );
};

export default ManageScheduledPosts;
