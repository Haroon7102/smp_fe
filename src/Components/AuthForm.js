import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ onClose, isSignUp: initialSignUp, setIsLoggedIn }) => {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSignUp, setIsSignUp] = useState(initialSignUp);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setIsSignUp(initialSignUp);
    }, [initialSignUp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage("");

        if (isForgotPassword) {
            // Forgot Password Request
            try {
                const response = await axios.post("https://smp-be-mysql.vercel.app/auth/forgot-password", { email });
                setMessage(response.data.msg || "A reset link has been sent to your email.");
                setIsForgotPassword(false); // Hide the form after submission
                setEmail("");
            } catch (err) {
                setError(err.response?.data?.msg || "Something went wrong.");
            }
            return;
        }

        try {
            let url = isSignUp
                ? 'https://smp-be-mysql.vercel.app/auth/signup'
                : 'https://smp-be-mysql.vercel.app/auth/signin';
            const payload = { name, email, password };
            const response = await axios.post(url, payload);
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
            navigate('/dashboard');
            if (onClose) onClose();
        } catch (error) {
            setError(error.response?.data?.msg || 'Error during authentication');
        }
    };

    return (
        <div className="form-container">
            <h2>{isForgotPassword ? 'Forgot Password' : isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {message ? (
                <p className="success-message">{message}</p> // Display success message
            ) : (
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="error-message">{error}</p>}

                    {isForgotPassword ? (
                        <>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                            <button type="submit" className="submit-btn">
                                Send Reset Link
                            </button>
                            <button type="button" onClick={() => setIsForgotPassword(false)} className="toggle-btn">
                                Back to Sign In
                            </button>
                        </>
                    ) : (
                        <>
                            {isSignUp && (
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                            <button type="submit" className="submit-btn">
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            </button>
                            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
                                {isSignUp ? 'Already have an account? Sign In' : 'New here? Sign Up'}
                            </button>
                            <button type="button" onClick={() => setIsForgotPassword(true)} className="forgot-password-btn">
                                Forgot Password?
                            </button>
                        </>
                    )}
                    <button type="button" className="google-btn" onClick={() => window.location.href = 'https://smp-be-mysql.vercel.app/auth/google'}>
                        Continue with Google
                    </button>
                    <button type="button" className="close-btn" onClick={onClose}>Close</button>
                </form>
            )}
        </div>
    );
};

export default AuthForm;
