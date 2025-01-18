import React, { useState } from 'react';

export default function CaptionGenerator() {
    const [topic, setTopic] = useState('');
    const [captions, setCaptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateCaptions = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');
        setCaptions([]);

        try {
            const response = await fetch('https://smp-be-mysql.vercel.app/open-ai/generate-captions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate captions. Please try again.');
            }

            const data = await response.json();
            setCaptions(data.captions || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-blue-600">
                Social Media Caption Generator
            </h1>
            <div className="flex flex-col items-center space-y-4">
                <input
                    type="text"
                    placeholder="Enter Topic (e.g., Web Development)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full sm:w-2/3 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleGenerateCaptions}
                    disabled={loading || !topic.trim()}
                    className={`px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center space-x-2">
                            <svg
                                className="w-5 h-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            <span>Generating...</span>
                        </span>
                    ) : (
                        'Generate Captions'
                    )}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="space-y-6">
                {captions.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Generated Captions:</h2>
                        <ul className="mt-4 space-y-2">
                            {captions.map((caption, index) => (
                                <li
                                    key={index}
                                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                                >
                                    {caption}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}