import React, { useState } from "react";
import ProfileSideBar from "../../layout/ProfileSideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validatePasswords = () => {
        // Validate Current Password
        if (!currentPassword.trim()) {
            toast.error("Please enter your current password", {
                position: "top-right",
                theme: "colored",
                icon: "🔒"
            });
            return false;
        }

        // Validate New Password
        if (!newPassword.trim()) {
            toast.error("Please enter new password", {
                position: "top-right",
                theme: "colored",
                icon: "🔒"
            });
            return false;
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error(
                "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
                {
                    position: "top-right",
                    theme: "colored",
                    icon: "⚠️"
                }
            );
            return false;
        }

        // Validate Confirm Password
        if (!confirmPassword.trim()) {
            toast.error("Please confirm your new password", {
                position: "top-right",
                theme: "colored",
                icon: "🔒"
            });
            return false;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match", {
                position: "top-right",
                theme: "colored",
                icon: "❌"
            });
            return false;
        }

        // Check if new password is same as current
        if (currentPassword === newPassword) {
            toast.error("New password must be different from current password", {
                position: "top-right",
                theme: "colored",
                icon: "⚠️"
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (!validatePasswords()) {
            return;
        }

        try {
            toast.success("Password changed successfully! 🎉", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            // Clear form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(`Failed to change password: ${error.message} ❌`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="colored"
            />
            <ProfileSideBar />
            <div className="flex-1 flex flex-col items-center p-10">
                <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Re-enter new password"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
