import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProfileHeader from '../component/RequestProfile/ProfileHeader';
import ProfileInfo from '../component/RequestProfile/ProfileInfo';
import ContactSection from '../component/RequestProfile/ContactSection.jsx';
import Education from '../component/RequestProfile/Education';

const RequestProfile = () => {
    const { token } = useParams(); // Lấy requestId từ URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh cho Education
    const educationData = [
        { course: "Node.js Fundamentals", provider: "Udemy", duration: "Feb 2022 - Mar 2022", grade: "9.0" },
        { course: "React.js Development", provider: "Coursera", duration: "Apr 2022 - Jun 2022", grade: "8.9" },
        { course: "Advanced JavaScript", provider: "Pluralsight", duration: "Jul 2022 - Aug 2022", grade: "9.9" },
    ];

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                let accessToken = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
                if (!accessToken) {
                    setError('No access token found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/view-requests/access/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    const studentProfile = data.data;

                    const mappedData = {
                        name: studentProfile.personalInfo.name || "Your Name",
                        email: studentProfile.personalInfo.email || "your.email@example.com",
                        fullName: studentProfile.personalInfo.name || "Your Full Name",
                        school: studentProfile.school || "Not specified",
                        age: studentProfile.age || "Not specified",
                        City: studentProfile.personalInfo.location || "Not specified",
                        englishSkill: studentProfile.englishSkill || "Not specified",
                        emails: [
                            {
                                address: studentProfile.personalInfo.email || "your.email@example.com",
                                time: studentProfile.requestInfo.expiresAt
                                    ? new Date(studentProfile.requestInfo.expiresAt).toLocaleString()
                                    : "Not specified",
                            },
                        ],
                        phone: [
                            {
                                number: studentProfile.personalInfo.phone || "your.phone",
                                time: studentProfile.requestInfo.expiresAt
                                    ? new Date(studentProfile.requestInfo.expiresAt).toLocaleString()
                                    : "Not specified",
                            },
                        ],
                        education: educationData,
                    };

                    setUserData(mappedData);
                } else {
                    setError(data.message || 'Failed to fetch student profile.');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching student profile:', err);
                if (err.message.includes('401') || err.message.includes('authorization denied')) {
                    setError('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('authToken');
                } else if (err.message.includes('ECONNREFUSED')) {
                    setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
                } else {
                    setError('Error fetching student profile: ' + err.message);
                }
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, [token]);

    if (loading) {
        return <div className="w-full bg-white p-5">Loading...</div>;
    }

    if (error) {
        return (
            <div className="w-full bg-white p-5">
                <p className="text-red-500">{error}</p>
                {error.includes('log in') && (
                    <button
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => window.location.href = '/login'}
                    >
                        Go to Login
                    </button>
                )}
                {error.includes('backend') && (
                    <p className="mt-2">
                        Start backend with: <code>npm start</code> or <code>node index.js</code>
                    </p>
                )}
            </div>
        );
    }

    if (!userData) {
        return <div className="w-full bg-white p-5">No student profile data available.</div>;
    }

    return (
        <div className="w-full bg-white p-5">
            <ProfileHeader name={userData.name} email={userData.email} />
            <div className="grid grid-cols-1 md:grid-cols-2 px-8 py-4">
                <div>
                    <ProfileInfo label="FULL NAME" value={userData.fullName} />
                    <ProfileInfo label="AGE" value={userData.age} />
                    <ProfileInfo label="ENGLISH SKILL" value={userData.englishSkill} />
                </div>
                <div>
                    <ProfileInfo label="SCHOOL" value={userData.school} />
                    <ProfileInfo label="CITY" value={userData.City} />
                </div>
            </div>
            <div className="p-6">
                <Education education={userData.education} />
                <ContactSection email={userData.emails[0]} phone={userData.phone[0]} />
            </div>
        </div>
    );
};

export default RequestProfile;
