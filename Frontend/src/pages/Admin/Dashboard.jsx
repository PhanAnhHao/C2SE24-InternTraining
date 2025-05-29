import { useState, useEffect } from "react";
import { FaUsers, FaUserGraduate, FaBook, FaChalkboardTeacher, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAccountStats } from './Stats/AccountStats';
import { getTestStats } from './Stats/TestStats';
import { getCourseStats } from './Stats/CourseStats';
import { getOnlineLearningStats } from './Stats/OnlineLearningStats';
import { getReviewStats } from './Stats/ReviewStats';

const Dashboard = () => {
    const [accountStats, setAccountStats] = useState({ total: 0 });
    const [testStats, setTestStats] = useState({ total: 0 });
    const [courseStats, setCourseStats] = useState({ total: 0 });
    const [onlineLearningStats, setOnlineLearningStats] = useState({ total: 0 });
    const [reviewStats, setReviewStats] = useState({ total: 0 });
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        fetchAccountStats();
        fetchTestStats();
        fetchCourseStats();
        fetchOnlineLearningStats();
        fetchReviewStats();
    }, []);

    const fetchAccountStats = async () => {
        const stats = await getAccountStats();
        setAccountStats(stats);
    };

    const fetchTestStats = async () => {
        const stats = await getTestStats();
        setTestStats(stats);
    };

    const fetchCourseStats = async () => {
        const stats = await getCourseStats();
        setCourseStats(stats);
    };

    const fetchOnlineLearningStats = async () => {
        const stats = await getOnlineLearningStats();
        setOnlineLearningStats(stats);
    };

    const fetchReviewStats = async () => {
        const stats = await getReviewStats();
        setReviewStats(stats);
    };

    // Listen for updates
    useEffect(() => {
        window.addEventListener('testsUpdated', fetchTestStats);
        window.addEventListener('coursesUpdated', fetchCourseStats);
        window.addEventListener('onlineLearningUpdated', fetchOnlineLearningStats);
        window.addEventListener('reviewsUpdated', fetchReviewStats);
        return () => {
            window.removeEventListener('testsUpdated', fetchTestStats);
            window.removeEventListener('coursesUpdated', fetchCourseStats);
            window.removeEventListener('onlineLearningUpdated', fetchOnlineLearningStats);
            window.removeEventListener('reviewsUpdated', fetchReviewStats);
        };
    }, []);

    const baseStats = [
        { name: "User", icon: <FaUsers />, count: accountStats.total },
        { name: "Student Test", icon: <FaUserGraduate />, count: testStats.total },
        { name: "Course", icon: <FaBook />, count: courseStats.total },
        { name: "Online Learning", icon: <FaChalkboardTeacher />, count: onlineLearningStats.total },
        { name: "Review Rating", icon: <FaStar />, count: reviewStats.total },
    ];

    const stats = userRole === 'Business'
        ? baseStats.filter(stat => stat.name !== "User")
        : baseStats;

    const chartData = [
        { name: "January", user: 30, courses: 5 },
        { name: "February", user: 50, courses: 8 },
        { name: "March", user: 70, courses: 12 },
        { name: "April", user: 90, courses: 15 },
        { name: "May", user: 110, courses: 20 },
    ];

    return (
        <div className="flex">
            <div className="flex-1 ">
                {/* <Header /> */}
                <h1 className="text-2xl font-bold text-gray-700 mt-4">Dashboard</h1>

                <div className="grid grid-cols-5 gap-4 mt-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 shadow-md rounded-lg flex flex-col items-center">
                            <span className="text-3xl text-teal-500">{stat.icon}</span>
                            <h2 className="text-xl font-semibold mt-2">{stat.name}</h2>
                            <p className="text-lg font-bold text-gray-700">{stat.count}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#4FD1C5" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="user" fill="#4FD1C5" barSize={40} />
                            <Bar dataKey="courses" fill="#FF6384" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
