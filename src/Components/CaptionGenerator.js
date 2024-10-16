import React, { useState } from 'react';
import axios from 'axios';

const CaptionGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');

    const generateCaption = async () => {
        try {
            const response = await axios.post('https://smp-be-mysql.vercel.app/generate-caption', { prompt }); // Updated URL
            setCaption(response.data.caption);
            setError('');
        } catch (error) {
            console.error('Error generating caption:', error);
            setError('Error generating caption');
        }
    };

    return (
        <div>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here"
            />
            <button onClick={generateCaption}>Generate Caption</button>
            {caption && <p>Caption: {caption}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CaptionGenerator;
