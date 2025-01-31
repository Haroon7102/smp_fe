import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const baseURL = 'https://smp-be-mysql.vercel.app'; // Replace with your backend's base URL


    const handleUpdatePassword = async ({ email }) => {
        console.log("email is here", email)
        try {
            const response = await axios.put(`${baseURL}/auth/update-password`, { email, password, newPassword }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            alert('Password updated successfully!');
            setPassword(''); // Reset password input
            setNewPassword(''); // Reset newPassword input
        } catch (error) {
            console.error('Error updating password:', error.response?.data || error.message);
            alert(error.response?.data?.msg || 'Failed to update password.');

            if (error.response?.data?.msg.includes("Google")) {
                setPassword("Google Account");
                setNewPassword("");
            }
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
                <h3>Update Password</h3>

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-3 py-2 border rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
