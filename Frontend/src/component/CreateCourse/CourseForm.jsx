import { useState, useEffect } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from 'uuid';

const CourseForm = ({ lessons }) => {
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

        if (!name.trim()) {
            newErrors.name = "Course name is required.";
        }

        if (!desc.trim()) {
            newErrors.desc = "Course description is required.";
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

        return newErrors;
    };

    const handleCreate = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Please fix the errors in the form.", { variant: "error" });
            return;
        }

        try {
            // Lấy businessId từ trong localStorage
            const businessId = localStorage.getItem('businessId');

            // Bước 1: Tạo Course
            const courseData = {
                idCourse: uuidv4(),
                infor: desc,
                languageID: languageID,
                businessId: businessId,
            };

            const courseResponse = await axios.post("http://localhost:5000/courses", courseData);
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
                console.log(lessonData);
                return axios.post("http://localhost:5000/lessons", lessonData);
            });

            await Promise.all(lessonPromises);

            enqueueSnackbar("Course and lessons created successfully!", { variant: "success" });

            // Reset form
            setName("");
            setDesc("");
            setLanguageID(languages.length > 0 ? languages[0]._id : "");
            setErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to create course. Please try again.";
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
                    rows={4}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-4">{errors.desc}</p>}

                <h2 className="font-bold mb-4 text-gray-700">Language</h2>
                <select
                    value={languageID}
                    onChange={(e) => setLanguageID(e.target.value)}
                    className={`w-full border ${errors.languageID ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4`}
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