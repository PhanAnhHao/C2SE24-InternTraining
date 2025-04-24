import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme_log from '../../assets/login_theme.jpg';

import Header from './Header';
import Notification from './Notification';
import RoleSelector from "./RoleSelector.jsx";
import Step1Form from "./Step1Form.jsx";
import Step2Form from "./Step2Form.jsx";
const RegisterPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        userName: '',
        location: '',
        phone: '',
        role: 'student',
        age: '',
        school: '',
        course: '',
        englishSkill: '',
        detail: '',
        type: '',
    });

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    const englishSkillOptions = ['Beginner', 'Intermediate', 'Advanced', 'Fluent'];
    const businessTypeOptions = ['Technology', 'Education'];

    useEffect(() => {
        setFormData((prev) => ({ ...prev, role }));
    }, [role]);

    const handleRole = (selectedRole) => {
        setRole(selectedRole);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({ ...errors, [name]: '' });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Username cannot be blank';
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setStep(2);
        }
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email cannot be blank';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.userName.trim()) newErrors.userName = 'Display name cannot be blank';
        if (!formData.location.trim()) newErrors.location = 'Location cannot be blank';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number cannot be blank';
        if (role === 'business' && !formData.detail.trim()) newErrors.detail = 'Detail cannot be blank';
        if (role === 'business' && !formData.type) newErrors.type = 'Please select a business type';
        if (formData.age && (isNaN(formData.age) || formData.age < 0)) {
            newErrors.age = 'Age must be a valid number (at least 0)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setErrors({});
            setApiError('');
            const url = role === 'student' ? '/auth/register' : '/auth/register-business';
            const response = await axios.post(`http://localhost:5000${url}`, formData);
            console.log('Register success:', response.data);
            setShowSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Register error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setApiError(error.response.data.message);
            } else {
                setApiError('Registration failed!');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Notification showSuccess={showSuccess} apiError={apiError} />
            <Header onHomeClick={() => navigate('/')} />
            <div className="flex flex-col md:flex-row w-screen gap-0">
                <div className="hidden md:flex md:w-1/3 bg-gray-20 items-center justify-center p-2 ml-80 mt-[100px]">
                    <div className="max-w-lg scale-250">
                        <img src={theme_log} alt="Student with books" className="w-[90%] max-w-sm" />
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center px-5 bg-white">
                    <div className="w-full max-w-md mx-auto px-6 py-8 bg-white rounded-lg shadow-md ml-40 h-auto mt-20">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Intern Training!</h1>
                            <div className="flex justify-center space-x-4 mb-6">
                                <Link to="/login" className="w-32">
                                    <button className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                                        Login
                                    </button>
                                </Link>
                                <div className="w-32">
                                    <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors duration-300">
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5 overflow-y">
                            <RoleSelector role={role} onRoleChange={handleRole} />
                            {step === 1 && (
                                <Step1Form
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleChange}
                                    onSubmit={handleStep1Submit}
                                    showPassword={showPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    togglePasswordVisibility={togglePasswordVisibility}
                                    toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                                />
                            )}
                            {step === 2 && (
                                <Step2Form
                                    formData={formData}
                                    errors={errors}
                                    role={role}
                                    onChange={handleChange}
                                    onSubmit={handleStep2Submit}
                                    onBack={() => setStep(1)}
                                    englishSkillOptions={englishSkillOptions}
                                    businessTypeOptions={businessTypeOptions}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;