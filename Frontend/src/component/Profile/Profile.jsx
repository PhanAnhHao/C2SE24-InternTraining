import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileSideBar from "../../layout/ProfileSideBar";
import theme_log from '../../assets/login_theme.jpg';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:5000/auth/me", {
                    headers: {
                        // Nếu dùng token, thêm dòng này:
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Lỗi khi fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ProfileSideBar role="Business" />
            <div className="flex-1 p-8">
                <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân (Doanh nghiệp)</h2>

                {profileData ? (
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-8">
                        <div className="relative">
                            <img
                                src={theme_log}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <button className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full text-white">
                                ✎
                            </button>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Tên doanh nghiệp: </span>{profileData.userName}</p>
                            <p><span className="font-semibold">Email: </span>{profileData.email} ✅</p>
                            <p><span className="font-semibold">SĐT: </span>{profileData.phone || "Chưa cập nhật"}</p>
                            <p><span className="font-semibold">Địa chỉ: </span>{profileData.location || "Chưa cập nhật"}</p>
                            <p><span className="font-semibold">Tên tài khoản: </span>{profileData.idAccount?.username}</p>
                            <p><span className="font-semibold">Vai trò: </span>{profileData.idAccount?.role?.name}</p>
                            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                                Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Đang tải thông tin...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
