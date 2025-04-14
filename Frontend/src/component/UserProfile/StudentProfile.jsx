import React from "react";
import ProfileSideBar from "../../layout/ProfileSideBar";
import theme_log from '../../assets/login_theme.jpg';


const StudentProfile = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <ProfileSideBar role="Student" />
            <div className="flex-1 p-8">
                <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân</h2>
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
                        <p><span className="font-semibold">Tên: </span>Hai</p>
                        <p><span className="font-semibold">Email: </span>tranvanhait2003@gmail.com ✅</p>
                        <p><span className="font-semibold">SĐT: </span>Chưa cập nhật</p>
                        <p><span className="font-semibold">Địa chỉ: </span>Chưa cập nhật</p>
                        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
