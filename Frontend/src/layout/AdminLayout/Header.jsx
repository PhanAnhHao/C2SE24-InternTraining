import { FaBell, FaSearch } from "react-icons/fa"; // Loại FaUserCircle vì dùng AvatarDropdown
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; // Thêm useState và useEffect
import axios from "axios"; // Thêm axios để gọi API nếu cần
import AvatarDropdown from "../AvatarDropdown"; // Import AvatarDropdown

const Header = () => {
    const location = useLocation();

    const pageTitles = {
        "/admin/dashboard": "Dashboard",
        "/admin/students": "Manage Student",
        "/admin/students-test": "Manage Student Test",
        "/admin/courses": "Manage Course",
        "/admin/online-learning": "Manage Online Learning",
        "/admin/reviews": "Manage Review Rating",
    };

    const currentPath = location.pathname;
    const pageTitle = pageTitles[currentPath] || "Dashboard";

    const [avatar, setAvatar] = useState(null); // State cho avatar
    const [userName, setUserName] = useState(""); // State cho userName

    // Lấy dữ liệu từ localStorage hoặc API
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/auth/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache, no-store",
                        },
                        params: { _t: new Date().getTime() },
                    });

                    if (response.data) {
                        let avatarUrl = response.data.avatar;
                        if (avatarUrl && avatarUrl.includes("firebasestorage")) {
                            avatarUrl = avatarUrl.includes("?")
                                ? avatarUrl.replace(/(\?|&)_t=\d+/, "") + "&_t=" + new Date().getTime()
                                : avatarUrl + "?_t=" + new Date().getTime();
                        }
                        setAvatar(avatarUrl || null);
                        setUserName(response.data.userName || "User");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setAvatar(null);
                    setUserName("User");
                }
            };
            fetchUserData();
        } else {
            setAvatar(null);
            setUserName("User");
        }
    }, []);

    return (
        <header className="bg-white p-4 flex items-center justify-between w-full shadow-md">
            {/* Page Title */}
            <div className="flex items-center text-gray-500 text-sm">
                <span className="text-gray-400">Pages</span>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-700">{pageTitle}</span>
            </div>

            {/* Search Bar */}
            <div className="flex items-center w-full max-w-lg bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="bg-transparent ml-2 outline-none text-gray-700 w-full placeholder-gray-400"
                />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6 pr-6">
                <AvatarDropdown avatar={avatar} userName={userName} /> {/* Thay bằng AvatarDropdown */}
            </div>
        </header>
    );
};

export default Header;