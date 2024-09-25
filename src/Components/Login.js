import React from 'react';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <h2>Login</h2>
            <a href="http://localhost:5000/auth/facebook" className="btn facebook-btn">Login with Facebook</a>
            <a href="http://localhost:5000/auth/instagram" className="btn instagram-btn">Login with Instagram</a>
        </div>
    );
};

export default Login;
