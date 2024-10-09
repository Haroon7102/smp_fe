import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const baseURL = 'http://localhost:5000'; // Replace with your backend's base URL

    const handleUpdateEmail = async () => {
        try {
            const response = await axios.put(`${baseURL}/auth/update-email`, { email }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            alert('Email updated successfully!');
            setEmail(''); // Reset email input
        } catch (error) {
            console.error('Error updating email:', error.response?.data || error.message);
            alert(error.response?.data?.msg || 'Failed to update email.');
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const response = await axios.put(`${baseURL}/auth/update-password`, { password, newPassword }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            alert('Password updated successfully!');
            setPassword(''); // Reset password input
            setNewPassword(''); // Reset newPassword input
        } catch (error) {
            console.error('Error updating password:', error.response?.data || error.message);
            alert(error.response?.data?.msg || 'Failed to update password.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${baseURL}/auth/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            alert('Account deleted successfully!');
            localStorage.removeItem('token'); // Optionally clear the token
            // Optionally redirect the user after account deletion
            window.location.href = '/'; // Redirect to login or home page
        } catch (error) {
            console.error('Error deleting account:', error.response?.data || error.message);
            alert(error.response?.data?.msg || 'Failed to delete account.');
        }
    };

    return (
        <div>
            <h2>Settings</h2>
            <div>
                <h3>Update Email</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="New email"
                />
                <button onClick={handleUpdateEmail}>Update Email</button>
            </div>

            <div>
                <h3>Update Password</h3>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Current password"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                />
                <button onClick={handleUpdatePassword}>Update Password</button>
            </div>

            <div>
                <h3>Delete Account</h3>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
};

export default Settings;
