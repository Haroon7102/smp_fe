import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ onClose, isSignUp: initialSignUp, setIsLoggedIn }) => {
    const [isSignUp, setIsSignUp] = useState(initialSignUp);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState(''); // For reset password
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setIsSignUp(initialSignUp);
    }, [initialSignUp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let url;
            let method = 'POST'; // Default method

            if (isResetPassword) {
                // Password reset logic
                url = 'https://main--smpbe.netlify.app/auth/update-password'; // Updated backend URL
                method = 'PUT'; // Change to PUT for password reset
                const payload = { email, password, newPassword };
                await axios({ method, url, data: payload });

                console.log('Password reset successful');
                // Reset form fields and state
                setIsResetPassword(false);
                setEmail('');
                setNewPassword('');
                // Optionally, navigate to the login page or show a success message
            } else {
                // Sign up or sign in logic
                url = isSignUp
                    ? 'https://main--smpbe.netlify.app/auth/signup'  // Updated backend URL for signup
                    : 'https://main--smpbe.netlify.app/auth/signin'; // Updated backend URL for signin
                const payload = { name, email, password };
                const response = await axios.post(url, payload);
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
                navigate('/dashboard');
            }

            if (onClose) onClose();
        } catch (error) {
            console.error('Authentication error:', error);

            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                setError(error.response.data.msg || 'Error during authentication');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setError('No response received from server');
            } else {
                console.error('Error message:', error.message);
                setError('Error during authentication');
            }
        }
    };

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        setError('');
    };

    const handleGoogleSignIn = () => {
        window.location.href = 'https://main--smpbe.netlify.app/auth/google'; // Updated Google sign-in URL
    };

    const handleForgotPassword = () => {
        setIsResetPassword(true);
        setError('');
    };

    return (
        <div className="form-container">
            <h2>{isResetPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                {!isResetPassword && isSignUp && (
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
                {!isResetPassword && (
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                )}
                {isResetPassword && (
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                )}
                <button type="submit" className="submit-btn">
                    {isResetPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                {!isResetPassword && (
                    <button type="button" onClick={toggleForm} className="toggle-btn">
                        {isSignUp ? 'Already have an account? Sign In' : 'New here? Sign Up'}
                    </button>
                )}
                {!isResetPassword && (
                    <button type="button" onClick={handleForgotPassword} className="forgot-password-btn">
                        Forgot Password?
                    </button>
                )}
                <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                    Continue with Google
                </button>
                <button type="button" className="close-btn" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default AuthForm;
