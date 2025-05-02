import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaBook,
    FaChalkboardTeacher,
    FaStar,
    FaSignOutAlt,
    FaQuestionCircle,
    FaUserGraduate,
    FaBuilding,

} from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("Dashboard");

    const menuItems = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
        { name: "Manage account", icon: <FaUsers />, path: "/dashboard/accounts" },
        { name: "Manage Student Test", icon: <FaUserGraduate />, path: "/dashboard/students-test" },
        { name: "Manage Course", icon: <FaBook />, path: "/dashboard/courses" },
        { name: "Manage Online Learning", icon: <FaChalkboardTeacher />, path: "/dashboard/online-learning" },
        { name: "Manage Review Rating", icon: <FaStar />, path: "/dashboard/reviews" },
    ];

    const handleNavigation = (path, name) => {
        setActiveItem(name);
        navigate(path);
    };

    return (
        <div className="w-72 h-screen p-6 flex flex-col justify-between">
            {/* Logo */}
            <div>
                <div className="flex items-center cursor-pointer py-2">
                    <div className="relative w-12 h-12 flex items-center justify-center border-4 border-[#4FD1C5] transform rotate-45">
                        <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
                    </div>
                    <h1 className="ml-6 text-2xl font-bold text-gray-600">Intern Training</h1>
                </div>

                {/* Navigation */}
                <nav className="mt-5">
                    <ul>
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`flex items-center p-3 mt-2 rounded-lg cursor-pointer transition 
                                    ${activeItem === item.name ? "bg-white shadow font-semibold" : "hover:bg-gray-200"}`}
                                onClick={() => handleNavigation(item.path, item.name)}
                            >
                                <span className={`text-teal-500 ${activeItem === item.name ? "font-bold" : ""}`}>
                                    {item.icon}
                                </span>
                                <span className="ml-3">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Account Pages */}
                <h2 className="mt-6 font-semibold text-gray-600">ACCOUNT</h2>
                <ul>
                    <li
                        className="flex items-center p-3 mt-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                        onClick={() => handleNavigation("/login")}
                    >
                        <FaSignOutAlt className="text-teal-500" />
                        <span className="ml-3">Log out</span>
                    </li>
                </ul>
            </div>

            {/* Help Section */}
            <div className="bg-[#4FD1C5] p-4 rounded-lg text-center">
                <FaQuestionCircle className="text-white text-2xl" />
                <p className="text-sm text-white mt-2">Need help?<br />Please check our docs</p>
                <button
                    className="mt-3 px-4 py-2 bg-white rounded-lg shadow font-semibold hover:bg-gray-200"
                    onClick={() => navigate("/docs")}
                >
                    DOCUMENTATION
                </button>
            </div>
        </div>
    );
};

export default Sidebar;