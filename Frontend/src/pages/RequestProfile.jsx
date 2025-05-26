import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../component/RequestProfile/ProfileHeader';
import ProfileInfo from '../component/RequestProfile/ProfileInfo';
import ContactSection from '../component/RequestProfile/ContactSection.jsx';
import Education from '../component/RequestProfile/Education';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const RequestProfile = () => {
    const { token } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [educationData, setEducationData] = useState([]);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                let accessToken = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
                if (!accessToken) {
                    setError('No access token found. Please log in.');
                    setLoading(false);
                    return;
                }

                // Gọi API chính để lấy dữ liệu sinh viên và avatar/cv
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
                if (!data.success) {
                    setError(data.message || 'Failed to fetch student profile.');
                    setLoading(false);
                    return;
                }

                const studentProfile = data.data;
                console.log('Student profile response:', studentProfile);
                const studentId = studentProfile.objectId;
                if (!studentId) {
                    throw new Error('Student ID not found in profile data.');
                }

                // Gọi API /students/{studentId} để lấy avatar và cv
                const studentDetailsResponse = await fetch(`http://localhost:5000/students/${studentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store'
                    },
                    params: { _t: new Date().getTime() },
                });

                if (!studentDetailsResponse.ok) {
                    throw new Error(`Failed to fetch student details: ${studentDetailsResponse.status}`);
                }

                const studentDetails = await studentDetailsResponse.json();
                console.log('Student details response:', studentDetails);

                let avatarUrl = studentDetails.userId.avatar;
                if (avatarUrl && avatarUrl.includes('firebasestorage')) {
                    avatarUrl = avatarUrl.includes('?')
                        ? avatarUrl.replace(/(\?|&)_t=\d+/, '') + '&_t=' + new Date().getTime()
                        : avatarUrl + '?_t=' + new Date().getTime();
                }

                const cvData = studentDetails.userId.cv || null;

                // Gọi API để lấy tất cả khóa học
                const allCoursesResponse = await fetch(
                    `http://localhost:5000/courses`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        credentials: 'include',
                    }
                );

                if (!allCoursesResponse.ok) {
                    throw new Error(`Error fetching all courses: ${allCoursesResponse.status}`);
                }

                const allCourses = await allCoursesResponse.json();
                console.log('All courses:', allCourses);

                // Lấy điểm test cho từng khóa học
                const educationDataPromises = allCourses.map(async (course) => {
                    try {
                        const testResultsResponse = await fetch(
                            `http://localhost:5000/history/course/${course.id}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                                credentials: 'include',
                            }
                        );

                        if (!testResultsResponse.ok) {
                            console.warn(`Could not fetch test results for course ${course.id}`);
                            return null;
                        }

                        const testResultsData = await testResultsResponse.json();
                        const testResults = testResultsData.testResults || [];

                        const studentTests = testResults.filter(
                            (test) => test.studentId === studentId
                        );

                        if (studentTests.length === 0) {
                            return null;
                        }

                        const latestTest = studentTests.reduce((latest, current) =>
                            new Date(current.completedAt) > new Date(latest.completedAt)
                                ? current
                                : latest
                        );
                        const grade = latestTest.score;

                        if (grade === null || grade === undefined) {
                            return null;
                        }

                        return {
                            courseName: course.infor || course.name || 'Unknown Course',
                            provider: course.businessId?.userId?.userName || 'Unknown Provider',
                            grade: grade.toFixed(1),
                            avgRating: course.avgRating || 0,
                            ratingsCount: course.ratingsCount || 0,
                            id: course._id
                        };
                    } catch (err) {
                        console.warn(`Error fetching test results for course ${course.id}:`, err);
                        return null;
                    }
                });

                const educationDataResults = await Promise.all(educationDataPromises);
                const filteredEducationData = educationDataResults.filter((data) => data !== null);
                setEducationData(filteredEducationData);

                const mappedData = {
                    name: studentProfile.personalInfo.name || 'Your Name',
                    email: studentProfile.personalInfo.email || 'your.email@example.com',
                    fullName: studentProfile.personalInfo.name || 'Your Full Name',
                    school: studentProfile.school || 'Not specified',
                    age: studentProfile.age || 'Not specified',
                    City: studentProfile.personalInfo.location || 'Not specified',
                    englishSkill: studentProfile.englishSkill || 'Not specified',
                    emails: [
                        {
                            address: studentProfile.personalInfo.email || 'your.email@example.com',
                            time: studentProfile.requestInfo.expiresAt
                                ? new Date(studentProfile.requestInfo.expiresAt).toLocaleString()
                                : 'Not specified',
                        },
                    ],
                    phone: [
                        {
                            number: studentProfile.personalInfo.phone || 'your.phone',
                            time: studentProfile.requestInfo.expiresAt
                                ? new Date(studentProfile.requestInfo.expiresAt).toLocaleString()
                                : 'Not specified',
                        },
                    ],
                    education: filteredEducationData,
                    avatar: avatarUrl,
                    cv: cvData
                };

                setUserData(mappedData);
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
                        onClick={() => (window.location.href = '/login')}
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
            <ProfileHeader name={userData.name} email={userData.email} avatar={userData.avatar} />
            <div className="grid grid-cols-1 md:grid-cols-2 px-8 py-4">
                <div>
                    <ProfileInfo label="FULL NAME" value={userData.fullName} />
                    <ProfileInfo label="AGE" value={userData.age} />
                    <ProfileInfo label="ENGLISH SKILL" value={userData.englishSkill} />
                    {userData.cv && (
                        <ProfileInfo
                            label="CV"
                            value={
                                <a
                                    href={userData.cv.url}
                                    download={userData.cv.fileName || 'cv_file'}
                                    className="text-blue-500 hover:underline flex items-center"
                                >
                                    {userData.cv.fileName || 'Download CV'}
                                    <FontAwesomeIcon icon={faDownload} className="ml-2" />
                                </a>
                            }
                        />
                    )}
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