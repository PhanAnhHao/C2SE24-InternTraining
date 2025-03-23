import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import theme_log from '../../assets/ava_lap.jpg';

const RegisterPage = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role: 'student'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register data:', formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {/* Logo */}
            <div div className="flex items-center cursor-pointer ml-8 mt-5 mb-[-120px]" onClick={() => navigate("/")} >
                <div
                    className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45 " >IT</span>
                </div>
                <span className='ml-4 font-semibold text-sky-500'> Home &lt;&lt;</span>
            </div >
            <div className="flex flex-col md:flex-row h-screen w-screen gap-0">
                {/* Left side - Illustration */}
                <div className="hidden md:flex md:w-1/3 bg-gray-20 items-center justify-center p-2 ml-80">
                    <div className="max-w-lg scale-190">
                        <img src={theme_log} alt="Student with books" className="w-[96%]" />
                    </div>
                </div>

                {/* Right side - Register form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-5 mt-[70px]  mr-[20px] bg-white">
                    <div className="w-full max-w-md mx-auto px-6 py-8 bg-white rounded-lg shadow-md ml-50">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold mb-2">Welcome to Lorem!</h1>
                            <div className="flex justify-center space-x-4 mb-6">
                                <Link to="/user-login" className="w-32">
                                    <button className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
                                        Login
                                    </button>
                                </Link>
                                <div className="w-32">
                                    <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors">
                                        Register
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your Email Address"
                                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="username">
                                    User name
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your User name"
                                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
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

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="role">
                                    Register as
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full bg-teal-400 text-white px-4 py-3 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;