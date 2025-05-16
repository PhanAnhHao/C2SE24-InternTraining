import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const AvatarDropdown = ({ avatar, userName }) => {
    const [open, setOpen] = useState(false);
    const [hasImageError, setHasImageError] = useState(false); // Thêm state
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [role, setRole] = useState(""); // Thêm state để lưu role từ localStorage

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.clear();
        navigate("/login");
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setHasImageError(false); // Reset lỗi khi avatar thay đổi
    }, [avatar]);

    // Lấy role từ localStorage khi component mount
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 cursor-pointer"
            >
                <span className="text-gray-900">{userName || "User"}</span>
                {avatar && !hasImageError ? (
                    <img
                        src={`${avatar}${avatar.includes('?') ? '&' : '?'}v=${new Date().getTime()}`}
                        alt="User Avatar"
                        className="w-9 h-9 rounded-full object-cover"
                        onError={() => setHasImageError(true)} // Đặt lỗi nếu load thất bại
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-[35px] text-gray-600 rounded-full border"
                    />
                )}
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <button
                        onClick={() => {
                            navigate("/profile");
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        View Profile
                    </button>
                    {role === "Business" && (
                        <button
                            onClick={() => {
                                navigate("/dashboard");
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            View DashBoard
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;