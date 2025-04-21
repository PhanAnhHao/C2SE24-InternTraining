import React, { useState } from "react";
import ProfileSideBar from "../../layout/ProfileSideBar";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle change password logic here
        console.log("Submitting:", { currentPassword, newPassword, confirmPassword });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ProfileSideBar />
            <div className="flex-1 flex flex-col items-center p-10">
                <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
