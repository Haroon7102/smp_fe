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
    const API_URL = "https://smp-be-mysql.vercel.app/open-ai/generate-captions";

    const handleSend = async () => {
        if (!input) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: input }),
            });

            const data = await response.json();
            const botMessage = data.response || "No relevant response received.";

            setMessages([...newMessages, { sender: "bot", text: botMessage }]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages([...newMessages, { sender: "bot", text: "Error fetching response." }]);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto mt-10 border rounded shadow-lg bg-white">
            <div className="space-y-4 flex flex-col h-[500px]">
                <div className="h-full overflow-y-auto border p-2 rounded bg-gray-100">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                            <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
                            {msg.text}
                            {msg.sender === "bot" && (
                                <button
                                    className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded"
                                    onClick={() => handleCopy(msg.text)}
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <input
                        className="border p-2 w-3/4 rounded shadow-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your post idea..."
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
