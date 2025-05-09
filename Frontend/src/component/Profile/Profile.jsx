import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileSideBar from "../../layout/ProfileSideBar";
import theme_log from "../../assets/login_theme.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phone: "",
        location: ""
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const getAvatarUrl = (avatar) => {
        if (!avatar) return theme_log;
        if (avatar.startsWith("http")) return avatar;
        return `http://localhost:5000/avatars/${avatar}`;
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get("http://localhost:5000/auth/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log('API /auth/me trả về:', response.data);
            setProfileData(response.data);
            setFormData({
                userName: response.data.userName || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                location: response.data.location || ""
            });
            setAvatarPreview(getAvatarUrl(response.data.avatar));
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to fetch profile data.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                "http://localhost:5000/auth/edit-me",
                {
                    userName: formData.userName,
                    email: formData.email,
                    phone: formData.phone,
                    location: formData.location
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            toast.success("Profile updated successfully!");
            setTimeout(() => {
                // window.location.reload();
                setAvatarPreview(imageUrl);
                setProfileData((prev) => ({ ...prev, avatar: imageUrl }));
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatar) return;

        // 1. Upload file lên Firebase
        const formData = new FormData();
        formData.append('image', avatar);

        try {
            // Upload lên Firebase
            const uploadRes = await axios.post(
                "http://localhost:5000/avatars",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            const imageUrl = uploadRes.data.imageUrl;

            // 2. Gửi URL lên API cập nhật avatar cho user đang đăng nhập
            await axios.put(
                "http://localhost:5000/auth/update-avatar",
                { avatar: imageUrl },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setAvatarPreview(imageUrl);
            toast.success("Avatar updated successfully!");
            setAvatar(null);
            fetchProfile();
        } catch (error) {
            console.error("Error updating avatar:", error);
            toast.error("Failed to update avatar.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ToastContainer />
            <ProfileSideBar />
            <div className="flex-1 p-10 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Profile Information</h2>

                {profileData ? (
                    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-8">
                        {/* Row 1: Avatar */}
                        <div className="flex justify-center relative">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                onError={e => { e.target.onerror = null; e.target.src = theme_log; }}
                            />
                            <label
                                className="absolute bottom-2 right-[calc(50%-4rem)] bg-teal-500 hover:bg-teal-600 p-2 rounded-full text-white shadow-lg transition cursor-pointer"
                                title="Edit avatar"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                ✎
                            </label>
                            {avatar && (
                                <button
                                    onClick={handleAvatarUpload}
                                    className="absolute bottom-2 left-[calc(50%-4rem)] bg-green-500 hover:bg-green-600 p-2 rounded-full text-white shadow-lg transition"
                                    title="Save avatar"
                                >
                                    ✓
                                </button>
                            )}
                        </div>

                        {/* Row 2: Info / Edit Form */}
                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 text-gray-700">
                                <div><span className="font-semibold">Display Name: </span>{profileData.userName}</div>
                                <div><span className="font-semibold">Email: </span>{profileData.email} ✅</div>
                                <div><span className="font-semibold">Phone: </span>{profileData.phone || "Not updated"}</div>
                                <div><span className="font-semibold">Address: </span>{profileData.location || "Not updated"}</div>
                                <div><span className="font-semibold">Account: </span>{profileData.idAccount?.username}</div>
                                <div><span className="font-semibold">Role: </span>{profileData.idAccount?.role?.name}</div>
                            </div>
                        ) : (
                            <form onSubmit={handleEditSubmit} className="space-y-4 px-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                    <input
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-indigo-600 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Row 3: Edit Button */}
                        {!isEditing && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition"
                                >
                                    Edit Information
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading profile information...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
