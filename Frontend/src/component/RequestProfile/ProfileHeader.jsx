import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ name, email, profilePic }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    // Hàm xử lý khi nhấn nút "Go to Homepage"
    const handleGoToHomepage = () => {
        navigate('/'); // Điều hướng về trang chủ
    };

    return (
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-yellow-50">
            <div className="flex items-center">
                <img
                    src={profilePic || "/img/Profile.jpg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                />
                <div>
                    <h2 className="text-lg font-semibold">{name || "Your Name"}</h2>
                    <p className="text-sm text-gray-500">{email || "your.email@example.com"}</p>
                </div>
            </div>
            <button
                className="flex items-center font-semibold bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleGoToHomepage} // Gắn sự kiện onClick
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Go to Homepage
            </button>
        </div>
    );
};

export default ProfileHeader;