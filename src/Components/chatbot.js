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
    const [generatedCaptions, setGeneratedCaptions] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        try {
            const response = await fetch("https://smp-be-mysql.vercel.app/open-ai/generate-captions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await response.json();
            if (data.captions) {
                setGeneratedCaptions(data.captions);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCaptions.join("\n"));
        alert("Captions copied to clipboard!");
    };

    return (
        <div className="p-6 w-full max-w-md mx-auto mt-10 border rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-center">AI Caption Generator</h2>
            <div className="h-48 overflow-y-auto border p-3 rounded bg-gray-100">
                {generatedCaptions.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {generatedCaptions.map((caption, index) => (
                            <li key={index} className="mb-2">{caption}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Your generated captions will appear here...</p>
                )}
            </div>
            <div className="flex gap-2 mt-4">
                <input
                    className="border p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your post idea..."
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleSend}
                >
                    Generate
                </button>
            </div>
            {generatedCaptions.length > 0 && (
                <button
                    className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
                    onClick={handleCopy}
                >
                    Copy Captions
                </button>
            )}
        </div>
    );
};

export default Chatbot;
