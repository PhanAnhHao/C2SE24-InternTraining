import React, { useState } from "react";
import ProfileSideBar from "../../layout/ProfileSideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authorization token not found. Please login again.", {
                    position: "top-right",
                    theme: "colored"
                });
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/auth/change-password",
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true // Add this to handle cookies if needed
                }
            );

            if (response.status === 200) {
                toast.success("Password changed successfully! 🎉", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored"
                });

                // Clear form
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                // Reload page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // Handle specific error cases
            if (error.response) {
                // Server responded with error
                switch (error.response.status) {
                    case 401:
                        toast.error("Current password is incorrect", {
                            theme: "colored"
                        });
                        break;
                    case 403:
                        toast.error("Session expired. Please login again", {
                            theme: "colored"
                        });
                        break;
                    default:
                        toast.error(error.response.data.message || "Failed to change password", {
                            theme: "colored"
                        });
                }
            } else if (error.request) {
                // Request made but no response
                toast.error("Server not responding. Please try again later", {
                    theme: "colored"
                });
            } else {
                // Something else went wrong
                toast.error("Failed to change password. Please try again", {
                    theme: "colored"
                });
            }
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
