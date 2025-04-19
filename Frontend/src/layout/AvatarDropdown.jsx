import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AvatarDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 cursor-pointer"
            >
                <span className="text-gray-900">Lina</span>
                <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border"
                />
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
