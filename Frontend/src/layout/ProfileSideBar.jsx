import React from "react";
import { Home, BookOpen, KeyRound, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

const ProfileSideBar = ({ role }) => {
    const isBusiness = role === "Business";

    const sidebarItems = [
        {
            icon: <Home size={18} />,
            label: "Profile",
            path: isBusiness ? "/business-profile" : "/student-profile",
        },
        {
            icon: <BookOpen size={18} />,
            label: isBusiness ? "My Courses" : "Courses taken",
            path: isBusiness ? "/my-courses" : "/courses-taken",
        },
        {
            icon: <KeyRound size={18} />,
            label: "Change password",
            path: "/changepassword",
        },
        {
            icon: <LogOut size={18} />,
            label: "Log out",
            path: "/login",
            danger: true,
        },
    ];

    return (
        <div className="w-60 bg-white shadow-md h-screen p-4">
            <ul className="space-y-4">
                {sidebarItems.map((item, idx) => (
                    <li key={idx}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-indigo-100 transition ${isActive ? "bg-indigo-100 font-semibold" : ""
                                } ${item.danger
                                    ? "text-red-500 hover:text-red-700"
                                    : "text-gray-700"
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileSideBar;
