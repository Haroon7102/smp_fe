import React, { useEffect, useState } from 'react';

const FacebookPostEngagement = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);

    // Mock data to simulate engagement metrics
    const mockComments = [
        { user: 'John Doe', comment: 'Great post!' },
        { user: 'Jane Smith', comment: 'I love this content!' },
        { user: 'Alex Johnson', comment: 'Keep it up!' }
    ];

    const mockLikes = 45; // Example like count

    // Function to fetch comments and likes after permission is granted
    const fetchCommentsAndLikes = async () => {
        const accessToken = localStorage.getItem('facebookAccessToken');

        try {
            const response = await fetch(
                `https://graph.facebook.com/${postId}?fields=comments,likes.summary(true)&access_token=${accessToken}`
            );
            const data = await response.json();
            setComments(data.comments?.data || []);
            setLikes(data.likes?.summary?.total_count || 0);
        } catch (error) {
            console.error('Error fetching engagement metrics:', error);
        }
    };

    useEffect(() => {
        // For now, use mock data to simulate real functionality
        setComments(mockComments);
        setLikes(mockLikes);
        // Uncomment the below line when you get the permission to fetch real data
        // fetchCommentsAndLikes();
    }, [postId]);

    return (
        <div>
            <h3>Post Engagement Metrics</h3>
            <p>Likes: {likes}</p>
            <div>
                <h4>Comments:</h4>
                <ul>
                    {comments.map((item, index) => (
                        <li key={index}>
                            <strong>{item.user}:</strong> {item.comment}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FacebookPostEngagement;
