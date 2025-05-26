import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ name, email, avatar }) => {
    const [hasImageError, setHasImageError] = useState(false); // Thêm state để theo dõi lỗi ảnh
    const navigate = useNavigate(); // Hook để điều hướng
console.log(avatar)
    // Hàm xử lý khi nhấn nút "Go to Homepage"
    const handleGoToHomepage = () => {
        navigate('/'); // Điều hướng về trang chủ
    };

    return (
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-yellow-50">
            {avatar && !hasImageError ? (
                <img
                    src={avatar} // Loại bỏ cache-busting
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full mr-4 object-cover"
                    onError={() => setHasImageError(true)} // Đặt lỗi nếu load thất bại
                />
            ) : (
                <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-[35px] mr-4 text-gray-600 rounded-full border"
                />
            )}
            <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-gray-600">{email}</p>
            </div>
            <button
                className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleGoToHomepage}
            >
                Go to Homepage
            </button>
        </div>
    );
};

export default ProfileHeader;