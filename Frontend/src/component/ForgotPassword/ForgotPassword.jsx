import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const ForgotPassword = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Close modal when clicking outside
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    // Add escape key listener
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address", {
                position: "top-right",
                theme: "colored"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/auth/forgot-password",
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Password reset instructions sent to your email!", {
                    position: "top-right",
                    theme: "colored",
                    autoClose: 3000
                });
                setEmail('');
                setTimeout(() => {
                    onClose();
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to send reset instructions",
                {
                    position: "top-right",
                    theme: "colored"
                }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 modal-overlay"
            onClick={handleOutsideClick}
        >
            {/* Overlay with blur effect */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center">
                <div
                    className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out"
                    style={{
                        opacity: isOpen ? 1 : 0,
                        scale: isOpen ? 1 : 0.95
                    }}
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking modal content
                >
                    {/* Add close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
                    <p className="text-gray-600 mb-6">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Instructions"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;