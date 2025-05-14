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
        // Handle base64 images directly 
        if (avatar.startsWith('data:image')) return avatar;
        // Handle HTTP URLs
        if (avatar.startsWith("http")) return avatar;
        // Handle local uploads
        return `http://localhost:5000/upload/${avatar}`;
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                toast.error("Authentication required");
                return;
            }

            console.log("Fetching profile with token:", token ? "Valid token present" : "No token");

            const response = await axios.get("http://localhost:5000/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store"
                },
                // Add cache-busting parameter to avoid browser caching
                params: { _t: new Date().getTime() }
            });

            console.log('API /auth/me response:', response.data);

            if (!response.data) {
                console.error("Empty response from /auth/me");
                toast.error("Failed to fetch profile: Empty response");
                return;
            }

            setProfileData(response.data);
            setFormData({
                userName: response.data.userName || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                location: response.data.location || ""
            });

            // Log the avatar URL for debugging
            console.log("Avatar from API:", response.data.avatar);

            let avatarUrl = response.data.avatar;
            if (avatarUrl && avatarUrl.includes('firebasestorage')) {
                // Add or update cache busting parameter
                avatarUrl = avatarUrl.includes('?')
                    ? avatarUrl.replace(/(\?|&)_t=\d+/, '') + '&_t=' + new Date().getTime()
                    : avatarUrl + '?_t=' + new Date().getTime();
            }

            console.log("Using avatar URL:", avatarUrl);
            setAvatarPreview(getAvatarUrl(avatarUrl));
        } catch (error) {
            console.error("Error fetching profile:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status code:", error.response?.status);
            toast.error("Failed to fetch profile: " + (error.response?.data?.message || error.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Validate Display Name
        if (!formData.userName.trim()) {
            toast.error("Please enter your display name", {
                position: "top-right",
                theme: "colored",
                icon: "⚠️"
            });
            return false;
        }
        if (formData.userName.length < 2 || formData.userName.length > 50) {
            toast.error("Display Name must be between 2 and 50 characters", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            toast.error("Please enter your email address", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }

        // Validate Phone (optional)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            toast.error("Phone number must be 10-11 digits", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }

        // Validate Address (optional)
        if (!formData.location.trim()) {
            toast.error("Please enter your address", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }
        if (formData.location && formData.location.length > 200) {
            toast.error("Address cannot exceed 200 characters", {
                position: "top-right",
                theme: "colored"
            });
            return false;
        }

        return true;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validate form first
        if (!validateForm()) {
            return; // Return early if validation fails
        }

        // Show loading toast for update process
        const loadingToastId = toast.loading("Updating profile... 🔄", {
            position: "top-right",
            theme: "colored"
        });

        try {
            const response = await axios.put(
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

            // Update success toast
            toast.update(loadingToastId, {
                render: "Profile updated successfully! 🎉",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            // Refresh profile data and close edit mode
            await fetchProfile();
            setIsEditing(false);
        } catch (error) {
            // Update error toast
            toast.update(loadingToastId, {
                render: `Update failed: ${error.response?.data?.message || error.message} ❌`,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
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

        console.log("Starting avatar upload process...");

        // Show loading toast
        const loadingToastId = toast.loading("Uploading avatar...");

        try {
            const token = localStorage.getItem("token");
            console.log("Using token:", token ? "Valid token present" : "No token found");

            // Create FormData for the file
            const formData = new FormData();
            formData.append('avatar', avatar);  // Use 'avatar' as the field name

            // Send the file directly to update-avatar endpoint
            console.log("Uploading avatar to update-avatar endpoint...");
            const updateRes = await axios.put(
                "http://localhost:5000/auth/update-avatar",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Avatar update response:", updateRes.data);

            if (updateRes.data) {
                // Update was successful
                toast.dismiss(loadingToastId);
                toast.success("Avatar updated successfully!");

                // Update local avatar immediately if URL is in response
                if (updateRes.data.avatar) {
                    setAvatarPreview(updateRes.data.avatar);
                }
                setAvatar(null);

                // Try to update localStorage user object if it exists
                try {
                    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                    if (updateRes.data.avatar) {
                        currentUser.avatar = updateRes.data.avatar;
                        localStorage.setItem("user", JSON.stringify(currentUser));
                    }
                } catch (e) {
                    console.error("Error updating user in localStorage:", e);
                }

                // Wait a bit to make sure backend has processed the update
                setTimeout(() => {
                    fetchProfile(); // Reload profile data with new avatar
                }, 1000);
            } else {
                toast.dismiss(loadingToastId);
                toast.error("Failed to update avatar: No response from server");
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            console.error("Error updating avatar:", error.response?.data || error.message);
            console.error("Response data:", error.response?.data);
            console.error("Status code:", error.response?.status);
            toast.error("Failed to update avatar: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <ProfileSideBar />
            <div className="flex-1 p-10 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Profile Information</h2>

                {profileData ? (
                    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-8">
                        {/* Row 1: Avatar */}
                        <div className="flex flex-col items-center relative">
                            <div className="relative mb-4">
                                <img
                                    src={avatarPreview && !avatarPreview.startsWith('data:image')
                                        ? `${avatarPreview}${avatarPreview.includes('?') ? '&' : '?'}v=${new Date().getTime()}`
                                        : avatarPreview}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                    onError={e => { e.target.onerror = null; e.target.src = theme_log; }}
                                />

                                {/* Upload controls */}
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <label className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Choose Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {avatar && (
                                        <button
                                            onClick={handleAvatarUpload}
                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Save Avatar
                                        </button>
                                    )}
                                </div>
                            </div>
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
                            <form onSubmit={handleEditSubmit} className="space-y-4 px-4" noValidate>
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
