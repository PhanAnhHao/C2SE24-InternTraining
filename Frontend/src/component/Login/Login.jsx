import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import theme_log from '../../assets/login_theme.jpg';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

const LoginPage = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password } = formData;

        if (!username) {
            setError('Please enter your username.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed. Please try again.');
                return;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('businessId', data.businessId);
                localStorage.setItem('studentId', data.studentId);


                // Save user role to localStorage
                if (data.role && data.role.name) {
                    localStorage.setItem('role', data.role.name);
                    // console.log(data.role.name);

                    // Redirect based on role
                    if (data.role.name === 'Business') {

                        navigate('/');
                    } else {
                        navigate('/');
                    }
                } else {
                    // Default redirect if role is not available
                    navigate('/');
                }
            } else {
                setError('No token received. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {/* Logo */}
            <div className="flex items-center cursor-pointer ml-8 mt-5 mb-[-120px]" onClick={() => navigate("/")}>
                <div className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
                </div>
                <span className='ml-4 font-semibold text-sky-500 hover:underline'> Home &lt;&lt;</span>
            </div>

            <div className="flex flex-col md:flex-row h-screen w-screen gap-0 mt-[50px]">
                {/* Left - image */}
                <div className="hidden md:flex md:w-1/3 bg-gray-20 items-center justify-center p-2 ml-80">
                    <div className="max-w-lg scale-250">
                        <img src={theme_log} alt="Student with books" className="w-[90%] max-w-sm" />
                    </div>
                </div>

                {/* Right - login form */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-5 bg-white">
                    <div className="w-full max-w-md mx-auto px-6 py-8 bg-white rounded-lg shadow-md ml-40">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold mb-4">Welcome to Intern Training!</h1>
                            <div className="flex justify-center space-x-4 mb-6">
                                <div className="w-32">
                                    <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors">
                                        Login
                                    </button>
                                </div>
                                <Link to="/register" className="w-32">
                                    <button className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
                                        Register
                                    </button>
                                </Link>
                            </div>
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
                                <a
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-teal-400 hover:text-teal-600 transition-colors cursor-pointer"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Thông báo lỗi */}
                            {error && (
                                <div className="text-red-500 text-sm mb-4 text-center">
                                    {error}
                                </div>
                            )}

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

            {/* Add the ForgotPassword component */}
            <ForgotPassword
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </>
    );
};

export default LoginPage;