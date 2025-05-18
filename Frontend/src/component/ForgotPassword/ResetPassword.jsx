import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true); // Changed to true initially
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('No reset token provided');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/auth/verify-reset-token/${token}`
                );

                if (response.data && response.data.valid === true) {
                    setLoading(false);
                } else {
                    throw new Error('Invalid or expired token');
                }
            } catch (err) {
                console.error('Token validation error:', err);
                setError(
                    err.response?.data?.message ||
                    'This password reset link is invalid or has expired.'
                );
                setLoading(false);
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        validateToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: "top-right",
                theme: "colored"
            });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error(
                'Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character',
                {
                    position: "top-right",
                    theme: "colored"
                }
            );
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:5000/auth/reset-password/${token}`,
                { newPassword }
            );

            if (response.status === 200) {
                toast.success('Your password has been reset successfully!', {
                    position: "top-right",
                    theme: "colored",
                    autoClose: 3000
                });
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            console.error('Reset password error:', err);
            toast.error(
                err.response?.data?.message || 'Failed to reset password',
                {
                    position: "top-right",
                    theme: "colored",
                    autoClose: 3000
                }
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPasswordForm;