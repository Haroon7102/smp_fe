import axios from 'axios';
import { useState } from 'react';

function ChatBot() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = async () => {
        const newMessage = { role: 'user', content: userMessage };
        setChatHistory([...chatHistory, newMessage]);

        try {
            const response = await axios.post('https://smp-be-mysql.vercel.app/open-ai/generate-captions', {
                prompt: userMessage,
            });
            const botMessage = { role: 'bot', content: response.data.caption };
            setChatHistory([...chatHistory, newMessage, botMessage]);
            setUserMessage('');
        } catch (error) {
            console.error('Error generating caption:', error.message);
        }
    };

    return (
        <div>
            <div className="chat-box">
                {chatHistory.map((message, index) => (
                    <div key={index} className={message.role}>
                        {message.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type a prompt..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default ChatBot;
