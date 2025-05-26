import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom"; // Thêm useNavigate

const CourseForm = ({ lessons }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [languageID, setLanguageID] = useState("");
    const [languages, setLanguages] = useState([]);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái để kiểm soát gửi yêu cầu

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/languages");
                setLanguages(response.data);
                if (response.data.length > 0) {
                    setLanguageID(response.data[0]._id);
                }
            } catch (error) {
                enqueueSnackbar("Failed to fetch languages.", { variant: "error" });
            }
        };
        fetchLanguages();
    }, [enqueueSnackbar]);

    const validateForm = () => {
        const newErrors = {};

        if (!desc.trim()) {
            newErrors.desc = "Course name is required.";
        }

        if (!languageID) {
            newErrors.languageID = "Please select a language.";
        }

        if (!lessons || lessons.length === 0) {
            newErrors.lessons = "At least one lesson is required to create a course.";
        }

        const businessId = localStorage.getItem('businessId');
        if (!businessId) {
            newErrors.businessId = "Business ID is required. Please log in.";
        }

        if (image) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!validImageTypes.includes(image.type)) {
                newErrors.image = "Only JPG, PNG, GIF, WebP, or SVG files are accepted.";
            }
            if (image.size > 5 * 1024 * 1024) { // 5MB
                newErrors.image = "Image size must not exceed 5MB.";
            }
        }
        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleCreate = async () => {
        if (isSubmitting) return; // Ngăn gửi yêu cầu nếu đang xử lý

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Please fix the errors in the form.", { variant: "error" });
            return;
        }

        setIsSubmitting(true); // Đặt trạng thái đang gửi yêu cầu
        try {
            const businessId = localStorage.getItem('businessId');

            const formData = new FormData();
            formData.append('idCourse', uuidv4());
            formData.append('infor', desc);
            formData.append('languageID', languageID);
            formData.append('businessId', businessId);
            if (image) {
                formData.append('image', image);
            }

            // Bước 1: Tạo Course
            const courseResponse = await axios.post("http://localhost:5000/courses", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const courseId = courseResponse.data._id;

            // Bước 2: Tạo Lessons
            const lessonPromises = lessons.map(async (lesson) => {
                const lessonData = {
                    idLesson: lesson.idLesson || uuidv4(),
                    idCourse: courseId,
                    name: lesson.name,
                    content: lesson.content || "",
                    linkVideo: lesson.linkVideo || "",
                    status: "draft",
                };
                return axios.post("http://localhost:5000/lessons", lessonData);
            });

            await Promise.all(lessonPromises);

            enqueueSnackbar("Course and lessons created successfully!", { variant: "success" });

            // Chuyển hướng sau khi tạo thành công
            navigate("/dashboard/courses"); // Chuyển hướng đến trang dashboard
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to create course. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái gửi yêu cầu
        }
    };

    return (
        <div className="w-full bg-[#F3FAFF]">
            <CourseHeader />
            <div className="bg-white m-8 p-6 rounded-2xl">
                <h2 className="font-bold mb-4 text-gray-700">Course Name</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Course Name"
                    className={`w-full border ${errors.desc ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    rows={4}
                    disabled={isSubmitting}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-4">{errors.desc}</p>}
                <h2 className="font-bold mb-4 text-gray-700">Image</h2>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageChange}
                    className={`w-full border ${errors.image ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    disabled={isSubmitting}
                />
                {errors.image && <p className="text-red-500 text-xs mb-4">{errors.image}</p>}
                {image && !isSubmitting && (
                    <div className="mb-4">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded border border-gray-300"
                        />
                    </div>
                )}
                <h2 className="font-bold mb-4 text-gray-700">Language</h2>
                <select
                    value={languageID}
                    onChange={(e) => setLanguageID(e.target.value)}
                    className={`w-full border ${errors.languageID ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    disabled={isSubmitting}
                >
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
                        onClick={handleCreate}
                        className={`bg-teal-500 hover:bg-teal-600 transition-colors text-white p-3 rounded font-semibold ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;