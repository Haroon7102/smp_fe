import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            const response = await axios.put("https://smp-be-mysql.vercel.app/auth/reset-password", {
                email,
                newPassword,
            });

            setMessage(response.data.msg);
            setError("");
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong.");
            setMessage("");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Update Password</h2>
                {message && <p className="text-green-600 text-center">{message}</p>}
                {error && <p className="text-red-600 text-center">{error}</p>}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
