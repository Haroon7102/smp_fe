import React, { useState } from 'react';
import './PostScheduler.css';

const PostScheduler = () => {
    const [caption, setCaption] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle post scheduling logic here
    };

    return (
        <main className="main-content">
            <h2>Schedule a Post</h2>
            <form onSubmit={handleSubmit} className="scheduler-form">
                <div className="form-group">
                    <label htmlFor="caption">Caption:</label>
                    <textarea
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Schedule Post</button>
            </form>
        </main>
    );
};

export default PostScheduler;
