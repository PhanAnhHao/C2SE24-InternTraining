import { useState, useEffect } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";

const CourseForm = ({ lessons, initialLessons, courseData, courseId }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [languageID, setLanguageID] = useState("");
    const [languages, setLanguages] = useState([]);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/languages");
                setLanguages(response.data);
            } catch (error) {
                enqueueSnackbar("Không thể lấy danh sách ngôn ngữ.", { variant: "error" });
            }
        };
        fetchLanguages();
    }, [enqueueSnackbar]);

    useEffect(() => {
        if (courseData) {
            setName(courseData.name || "");
            setDesc(courseData.infor || "");
            let selectedLanguageID = "";
            if (courseData.languageID) {
                selectedLanguageID = typeof courseData.languageID === "object"
                    ? courseData.languageID._id
                    : courseData.languageID;
            }
            if (languages.length > 0) {
                const isValidLanguage = languages.some(lang => lang._id === selectedLanguageID);
                if (selectedLanguageID && isValidLanguage) {
                    setLanguageID(selectedLanguageID);
                } else {
                    setLanguageID(languages[0]._id);
                }
            }
            // Lấy và hiển thị ảnh hiện tại từ courseData
            if (courseData.image) {
                setPreviewUrl(courseData.image); // Hiển thị URL ảnh hiện tại
            }
        } else if (languages.length > 0) {
            setLanguageID(languages[0]._id);
        }
    }, [courseData, languages]);

    const validateForm = () => {
        const newErrors = {};

        if (!desc.trim()) {
            newErrors.desc = "Mô tả khóa học là bắt buộc.";
        }

        if (!languageID) {
            newErrors.languageID = "Vui lòng chọn một ngôn ngữ.";
        }

        if (!lessons || lessons.length === 0) {
            newErrors.lessons = "Cần ít nhất một bài học để cập nhật khóa học.";
        }

        const businessId = localStorage.getItem('businessId');
        if (!businessId) {
            newErrors.businessId = "Cần ID doanh nghiệp. Vui lòng đăng nhập.";
        }
        if (image) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!validImageTypes.includes(image.type)) {
                newErrors.image = "Chỉ chấp nhận file JPG, PNG, GIF, WebP hoặc SVG.";
            }
            if (image.size > 5 * 1024 * 1024) { // 5MB
                newErrors.image = "Kích thước ảnh không được vượt quá 5MB.";
            }
        }
        return newErrors;
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // Cập nhật preview với ảnh mới
        }
    };
    const handleUpdate = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Vui lòng sửa các lỗi trong form.", { variant: "error" });
            return;
        }

        try {
            const businessId = localStorage.getItem('businessId');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('infor', desc);
            formData.append('languageID', languageID);
            formData.append('businessId', businessId);
            if (image) {
                formData.append('image', image); // Gửi ảnh mới nếu có
            }

            await axios.put(`http://localhost:5000/courses/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            enqueueSnackbar("Khóa học được cập nhật thành công!", { variant: "success" });
            setErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Không thể cập nhật khóa học. Vui lòng thử lại.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };
    return (
        <div className="w-full bg-[#F3FAFF]">
            <CourseHeader />
            <div className="bg-white m-8 p-6 rounded-2xl ">
                <h2 className="font-bold mb-4 text-gray-700">CourseName</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Course name"
                    className={`w-full border ${errors.desc ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    rows={4}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-4">{errors.desc}</p>}
                <h2 className="font-bold mb-4 text-gray-700">Image</h2>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageChange}
                    className={`w-full border ${errors.image ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                />
                {errors.image && <p className="text-red-500 text-xs mb-4">{errors.image}</p>}
                {(previewUrl || image) && (
                    <div className="mb-4">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded border border-gray-300"
                        />
                    </div>
                )}
                <h2 className="font-bold mb-4 text-gray-700">Language</h2>
                <select
                    value={languageID || ""}
                    onChange={(e) => setLanguageID(e.target.value)}
                    className={`w-full border ${errors.languageID ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                >
                    <option value="" disabled>
                        Choose language
                    </option>
                    {languages.map((lang) => (
                        <option key={lang._id} value={lang._id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
                {errors.languageID && <p className="text-red-500 text-xs mb-4">{errors.languageID}</p>}

                {errors.lessons && <p className="text-red-500 text-xs mb-4">{errors.lessons}</p>}
                {errors.businessId && <p className="text-red-500 text-xs mb-4">{errors.businessId}</p>}

                <div className="flex justify-end mt-20">
                    <button
                        onClick={handleUpdate}
                        className="bg-teal-500 hover:bg-teal-600 transition-colors text-white p-3 rounded font-semibold"
                    >
                        Update Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;