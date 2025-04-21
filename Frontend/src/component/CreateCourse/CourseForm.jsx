import { useState } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";

const CourseForm = ({ lessons }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({});

    const { enqueueSnackbar } = useSnackbar();

    // Hàm validate các trường
    const validateForm = () => {
        const newErrors = {};

        // Validate course name
        if (!name.trim()) {
            newErrors.name = "Course name is required.";
        }

        // Validate course description
        if (!desc.trim()) {
            newErrors.desc = "Course description is required.";
        }

        // Validate lessons: yêu cầu ít nhất 1 lesson
        if (!lessons || lessons.length === 0) {
            enqueueSnackbar("At least one lesson is required to create a course.", { variant: "error" });
        }

        return newErrors;
    };

    const handleCreate = async () => {
        const validationErrors = validateForm();

        // Nếu có lỗi, cập nhật state errors và không gửi form
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Please fix the errors in the form.", { variant: "error" });
            return;
        }

        const courseData = {
            name: name || "Untitled Course",
            description: desc,
            lessons: lessons,
        };

        console.log("Creating course:", courseData);

        try {
            const response = await axios.post("http://localhost:5000/courses", courseData);
            console.log("Course created successfully:", response.data);
            enqueueSnackbar("Course created successfully!", { variant: "success" });

            // Reset form sau khi tạo thành công
            setName("");
            setDesc("");
            setErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create new course. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <div className="w-full bg-[#F3FAFF]">
            <CourseHeader />
            <div className="bg-white m-8 p-6 rounded-2xl h-[600px]">
                <h2 className="font-bold mb-4 text-gray-700">Course Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Course Name..."
                    className={`w-full border ${errors.name ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                />
                {errors.name && <p className="text-red-500 text-xs mb-4">{errors.name}</p>}

                <h2 className="font-bold mb-4 text-gray-700">Course Description</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Course Description..."
                    className={`w-full border ${errors.desc ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
                    rows={8}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-4">{errors.desc}</p>}

                {errors.lessons && <p className="text-red-500 text-xs mb-4">{errors.lessons}</p>}

                <div className="flex justify-end mt-20">
                    <button
                        onClick={handleCreate}
                        className="bg-teal-500 hover:bg-teal-600 transition-colors text-white p-3 rounded font-semibold"
                    >
                        Create Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;