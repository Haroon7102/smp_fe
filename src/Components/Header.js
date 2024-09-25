import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import AuthForm from './AuthForm';
import logo from '../pictures/logo.jpeg';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);
            setIsLoggedIn(true);
            window.history.replaceState({}, document.title, "/dashboard"); // Remove token from URL
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
            }
        }

        const loadGoogleAuth = () => {
            if (window.gapi) {
                window.gapi.load('auth2', () => {
                    window.gapi.auth2.init({
                        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google client ID
                    });
                });
            }
        };

        const checkGapi = setInterval(() => {
            if (window.gapi) {
                clearInterval(checkGapi);
                loadGoogleAuth();
            }
        }, 100);

        return () => clearInterval(checkGapi); // Clean up the interval on component unmount
    }, []);

    const handleLoginClick = () => {
        setIsSignUp(false);
        setShowAuthForm(true);
    };

    const handleSignupClick = () => {
        setIsSignUp(true);
        setShowAuthForm(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');

        const auth2 = window.gapi?.auth2?.getAuthInstance();
        if (auth2) {
            auth2.signOut().then(() => {
                auth2.disconnect();
                console.log('User signed out from Google.');
            });
        }

        setIsLoggedIn(false);
        navigate('/');
    };

    const handleCloseAuthForm = () => {
        setShowAuthForm(false);
    };

    return (
        <>
            <header className="header">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo" className="logo-image" />
                    <h1>Social Manager Pro</h1>
                </div>
                <nav className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <button className="login-btn" onClick={handleLoginClick}>Login</button>
                            <button className="signup-btn" onClick={handleSignupClick}>Signup</button>
                        </>
                    )}
                </div>
            </header>
            {showAuthForm && (
                <div className="auth-form-overlay">
                    <AuthForm
                        onClose={handleCloseAuthForm}
                        isSignUp={isSignUp}
                        setIsLoggedIn={setIsLoggedIn}
                    />
                </div>
            )}
        </>
    );
}

export default Header;
