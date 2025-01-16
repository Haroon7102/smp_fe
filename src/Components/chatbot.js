import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add user message to chat
        setMessages([...messages, { text: userInput, user: true }]);

        // Send user input to your backend or OpenAI API
        try {
            const response = await axios.post('https://smp-be-mysql.vercel.app/open-ai/chat', { text: userInput });
            const botReply = response.data.reply;
            setMessages([...messages, { text: userInput, user: true }, { text: botReply, user: false }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setUserInput('');
    };

    return (
        <div className="chatbot-container">
            <div className="chat-window">
                {messages.map((message, index) => (
                    <div key={index} className={message.user ? 'user-message' : 'bot-message'}>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
