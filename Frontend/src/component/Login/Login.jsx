import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import theme_log from '../../assets/ava_lap.jpg';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const location = useLocation();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login data:', formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen gap-0">
            {/* Left side - Illustration */}
            <div className="hidden md:flex md:w-1/3 bg-gray-20 items-center justify-center p-2 ml-80">
                <div className="max-w-lg scale-250">
                    <img src={theme_log} alt="Student with books" className="w-full max-w-sm" />
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-5 bg-white">
                <div className="w-full max-w-md mx-auto px-6 py-8 bg-white rounded-lg shadow-md ml-40">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold mb-4">Welcome to Lorem!</h1>
                        <div className="flex justify-center space-x-4 mb-6">
                            <div className="w-32">
                                <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors">
                                    Login
                                </button>
                            </div>
                            <Link to="/user-register" className="w-32">
                                <button className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
                                    Register
                                </button>
                            </Link>
                        </div>
                        <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">User name</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your User name"
                                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your Password"
                                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="mr-2 focus:ring-teal-400 text-teal-400"
                                />
                                <span className="text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-teal-400 hover:text-teal-600 transition-colors">Forgot Password?</a>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-teal-400 text-white py-3 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;