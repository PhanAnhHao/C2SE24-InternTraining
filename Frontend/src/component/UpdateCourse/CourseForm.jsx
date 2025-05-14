import { useState, useEffect } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";

const CourseForm = ({ lessons, initialLessons, courseData, courseId }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [languageID, setLanguageID] = useState("");
    const [languages, setLanguages] = useState([]);
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

        const businessId = localStorage.getItem('userId');
        if (!businessId) {
            newErrors.businessId = "Cần ID doanh nghiệp. Vui lòng đăng nhập.";
        }

        return newErrors;
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

            // Xác định các lesson đã bị xóa
            const deletedLessons = initialLessons.filter(
                initialLesson => !lessons.some(lesson => lesson._id === initialLesson._id)
            );

            // Gửi yêu cầu DELETE cho các lesson đã bị xóa
            const deletePromises = deletedLessons.map(async (lesson) => {
                if (lesson._id) {
                    return axios.delete(`http://localhost:5000/lessons/${lesson._id}`);
                }
                return Promise.resolve(); // Bỏ qua nếu không có _id
            });

            await Promise.all(deletePromises);

            // Cập nhật khóa học
            const courseDataUpdate = {
                name,
                infor: desc,
                languageID,
                businessId,
            };

            await axios.put(`http://localhost:5000/courses/${courseId}`, courseDataUpdate);

            // Cập nhật hoặc tạo bài học
            const lessonPromises = lessons.map(async (lesson) => {
                const lessonData = {
                    idLesson: lesson.idLesson,
                    idCourse: courseId,
                    name: lesson.name,
                    content: lesson.content || "",
                    linkVideo: lesson.linkVideo || "",
                    status: lesson.status || "draft",

                };

                if (lesson._id) {
                    return axios.put(`http://localhost:5000/lessons/${lesson._id}`, lessonData);
                } else {
                    return axios.post("http://localhost:5000/lessons", lessonData);
                }
            });

            await Promise.all(lessonPromises);

            enqueueSnackbar("Khóa học và bài học được cập nhật thành công!", { variant: "success" });
            setErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Không thể cập nhật khóa học. Vui lòng thử lại.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <div className="w-full bg-[#F3FAFF]">
            <CourseHeader />
            <div className="bg-white m-8 p-6 rounded-2xl h-[600px]">
                <h2 className="font-bold mb-4 text-gray-700">Mô Tả Khóa Học</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Mô tả khóa học..."
                    className={`w-full border ${errors.desc ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    rows={4}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-4">{errors.desc}</p>}

                <h2 className="font-bold mb-4 text-gray-700">Ngôn Ngữ</h2>
                <select
                    value={languageID || ""}
                    onChange={(e) => setLanguageID(e.target.value)}
                    className={`w-full border ${errors.languageID ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                >
                    <option value="" disabled>
                        Chọn ngôn ngữ
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
                        Cập Nhật Khóa Học
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;