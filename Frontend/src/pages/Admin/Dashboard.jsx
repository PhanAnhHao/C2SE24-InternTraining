import { useState } from "react";
import { FaUsers, FaUserGraduate, FaBook, FaChalkboardTeacher, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const Dashboard = () => {
    const stats = [
        { name: "User", icon: <FaUsers />, count: 120 },
        { name: "Student Test", icon: <FaUserGraduate />, count: 95 },
        { name: "Course", icon: <FaBook />, count: 30 },
        { name: "Online Learning", icon: <FaChalkboardTeacher />, count: 50 },
        { name: "Review Rating", icon: <FaStar />, count: 200 },
    ];

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
