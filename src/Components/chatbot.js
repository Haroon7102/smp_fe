// import axios from 'axios';
// import { useState } from 'react';
// import './ChatBot.css';


// function ChatBot() {
//     const [userMessage, setUserMessage] = useState('');
//     const [chatHistory, setChatHistory] = useState([]);

//     const handleSendMessage = async () => {
//         const newMessage = { role: 'user', content: userMessage };
//         setChatHistory([...chatHistory, newMessage]);

//         try {
//             const response = await axios.post('https://smp-be-mysql.vercel.app/open-ai/generate-captions', {
//                 prompt: userMessage,
//             });
//             const botMessage = { role: 'bot', content: response.data.caption };
//             setChatHistory([...chatHistory, newMessage, botMessage]);
//             setUserMessage('');
//         } catch (error) {
//             console.error('Error generating caption:', error.message);
//         }
//     };

//     return (
//         <div>
//             <div className="chat-box">
//                 {chatHistory.map((message, index) => (
//                     <div key={index} className={message.role}>
//                         {message.content}
//                     </div>
//                 ))}
//             </div>
//             <input
//                 type="text"
//                 value={userMessage}
//                 onChange={(e) => setUserMessage(e.target.value)}
//                 placeholder="Type a prompt..."
//             />
//             <button onClick={handleSendMessage}>Send</button>
//         </div>
//     );
// }

// export default ChatBot;


import React, { useState } from "react";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const API_URL = "https://api.groq.com/v1/chat/completions";
    const API_KEY = "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"; // Replace with your Groq API key

    const handleSend = async () => {
        if (!input) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768",
                    messages: [{ role: "user", content: input }],
                    max_tokens: 100,
                }),
            });
            const data = await response.json();
            const botMessage = data.choices[0].message.content;
            setMessages([...newMessages, { sender: "bot", text: botMessage }]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto mt-10 border rounded">
            <div className="space-y-4">
                <div className="h-64 overflow-y-auto border p-2 rounded">
                    {messages.map((msg, index) => (
                        <p key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                            <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
                            {msg.text}
                        </p>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        className="border p-2 flex-1"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your post idea..."
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;