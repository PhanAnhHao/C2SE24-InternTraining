import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import AvatarDropdown from "./AvatarDropdown";

const Header = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ avatar: null, role: "b", userName: "" }); // Thêm userName

    const getAvatarUrl = (avatar) => {
        if (!avatar || avatar === "default-avatar.jpg") return null;
        if (avatar.startsWith("data:image")) return avatar;
        if (avatar.startsWith("http")) return avatar;
        return `http://localhost:5000/upload/${avatar}`;
    };

    useEffect(() => {
        const authData = localStorage.getItem("token");
        if (authData) {
            setLoggedIn(true);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/auth/me", {
                        headers: {
                            Authorization: `Bearer ${authData}`,
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache, no-store",
                        },
                        params: { _t: new Date().getTime() },
                    });

                    if (!response.data) {
                        console.error("Empty response from /auth/me");
                        localStorage.removeItem("token");
                        setLoggedIn(false);
                        return;
                    }

                    let avatarUrl = response.data.avatar;
                    if (avatarUrl && avatarUrl.includes("firebasestorage")) {
                        avatarUrl = avatarUrl.includes("?")
                            ? avatarUrl.replace(/(\?|&)_t=\d+/, "") + "&_t=" + new Date().getTime()
                            : avatarUrl + "?_t=" + new Date().getTime();
                    }

                    setUserData({
                        avatar: getAvatarUrl(avatarUrl),
                        role: response.data.idAccount?.role?.name || "b",
                        userName: response.data.userName || "User", // Lấy userName, mặc định là "User"
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    localStorage.removeItem("token");
                    setLoggedIn(false);
                    setUserData({ avatar: null, role: "b", userName: "" });
                }
            };
            fetchUserData();
        } else {
            setLoggedIn(false);
            setUserData({ avatar: null, role: "b", userName: "" });
        }
    }, [loggedIn]);

    return (
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-[5%] py-4 bg-white shadow-md z-50">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <div className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
                </div>
            </div>

            <div className="flex items-center space-x-8">
                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 text-gray-600">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "font-bold text-teal-400" : "hover:text-teal-400"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/course"
                        className={({ isActive }) =>
                            isActive ? "font-bold text-teal-400" : "hover:text-teal-400"
                        }
                    >
                        Courses
                    </NavLink>
                    {loggedIn && (
                        <NavLink
                            to={userData.role === "business" ? "/your-course" : "/course-attended"}
                            className={({ isActive }) =>
                                isActive ? "font-bold text-teal-400" : "hover:text-teal-400"
                            }
                        >
                            {userData.role === "business" ? "Your Courses" : "Course Attended"}
                        </NavLink>
                    )}
                    <NavLink
                        to="/blog-page"
                        className={({ isActive }) =>
                            isActive ? "font-bold text-teal-400" : "hover:text-teal-400"
                        }
                    >
                        Blog
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? "font-bold text-teal-400" : "hover:text-teal-400"
                        }
                    >
                        About Us
                    </NavLink>
                </nav>

                {/* User Profile */}
                {loggedIn ? (
                    <AvatarDropdown avatar={userData.avatar} userName={userData.userName} /> // Truyền thêm userName
                ) : (
                    <div className="flex justify-center space-x-4">
                        <Link to="/login" className="w-32">
                            <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link to="/register" className="w-32">
                            <button className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;