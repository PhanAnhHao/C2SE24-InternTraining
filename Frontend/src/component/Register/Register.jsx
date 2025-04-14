import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import theme_log from '../../assets/login_theme.jpg';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        userName: '',
        location: '',
        phone: '',
        role: role
    });

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleRole = (role) => {
        setRole(role);
    }

    useEffect(() => {
        if (!role) {
            setRole('student');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = "Username cannot be blank";
        if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.email.trim()) {
            newErrors.email = "Email cannot be blank";
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.userName.trim()) newErrors.userName = "Display name cannot be blank";
        if (!formData.location.trim()) newErrors.location = "Location cannot be blank";
        if (!formData.phone.trim()) newErrors.phone = "Phone number cannot be blank";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setErrors({});
            setApiError('');
            const response = await axios.post("http://localhost:5000/auth/register", formData);
            console.log('Register success:', response.data);
            setShowSuccess(true);
            setTimeout(() => navigate('/user-login'), 2000);
        } catch (error) {
            console.error('Register error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setApiError(error.response.data.message);
            } else {
                setApiError("Registration failed!");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in-down transition-transform duration-500">
                        🎉 Registration successful! Redirecting page...
                    </div>
                </div>
            )}

            {apiError && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in-down transition-transform duration-500">
                        ❌ {apiError}
                    </div>
                </div>
            )}

            <div className="flex items-center cursor-pointer ml-8 mt-5 mb-[-120px]" onClick={() => navigate("/")}>
                <div className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
                </div>
                <span className='ml-4 font-semibold text-sky-500 hover:underline'> Home &lt;&lt;</span>
            </div>

            <div className="flex flex-col md:flex-row h-screen w-screen gap-0 mt-[50px]">
                <div className="hidden md:flex md:w-1/3 bg-gray-20 items-center justify-center p-2 ml-80 mt-5">
                    <div className="max-w-lg scale-190">
                        <img src={theme_log} alt="Student with books" className="w-[96%]" />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex items-center justify-center p-5 mt-[400px] mr-[20px] bg-white">
                    <div className="w-full max-w-md mx-auto px-6 py-8 bg-white rounded-lg shadow-md ml-50">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold mb-2">Welcome to Lorem!</h1>
                            <div className="flex justify-center space-x-4 mb-6">
                                <Link to="/login" className="w-32">
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

                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <p>Choose your role, What do you wanna be? <span className='font-semibold text-red-500'>(Required*)</span></p>
                            <div className="role-buttons flex gap-3">
                                <button
                                    className={role === 'student'
                                        ? "w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors"
                                        : "w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"}
                                    onClick={() => handleRole('student')}
                                >Student</button>
                                <button className={role === 'business'
                                    ? "w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors"
                                    : "w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"}
                                    onClick={() => handleRole('business')}
                                >Business
                                </button>
                            </div>
                            {[
                                { label: "Username", name: "username", type: "text", placeholder: "Enter your Username" },
                                { label: "Password", name: "password", type: showPassword ? "text" : "password", placeholder: "Enter your Password", isPassword: true },
                                { label: "Email", name: "email", type: "email", placeholder: "Enter your Email" },
                                { label: "Display Name", name: "userName", type: "text", placeholder: "Enter your Display Name" },
                                { label: "Location", name: "location", type: "text", placeholder: "Enter your Location" },
                                { label: "Phone", name: "phone", type: "text", placeholder: "Enter your Phone number" },
                            ].map(({ label, name, type, placeholder, isPassword }) => (
                                <div key={name}>
                                    <label className="block text-gray-700 mb-2" htmlFor={name}>{label}</label>
                                    <div className="relative">
                                        <input
                                            type={type}
                                            id={name}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            placeholder={placeholder}
                                            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                        {isPassword && (
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        )}
                                    </div>
                                    {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
                                </div>
                            ))}

                            <div className="mt-6">
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
