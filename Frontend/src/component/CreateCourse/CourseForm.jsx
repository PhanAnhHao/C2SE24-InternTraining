import { useState } from "react";
import axios from "axios";
import CourseHeader from "./CourseHeader.jsx";
import { useSnackbar } from "notistack";

const CourseForm = ({ lessons }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async () => {
        const courseData = {
            name: name || "Untitled Course",
            description: desc,
            lessons: lessons || [],
        };

        console.log("Creating course:", courseData);

        try {
            const response = await axios.post("http://localhost:5000/courses", courseData);
            console.log("Course created successfully:", response.data);
            enqueueSnackbar("Course created successfully!", { variant: "success" });

            // Reset form sau khi tạo thành công
            setName("");
            setDesc("");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create new course. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
        <div className="w-full bg-[#F3FAFF] ">
            <CourseHeader />
            <div className="bg-white m-8 p-6 rounded-2xl h-[600px] ">
                <h2 className="font-bold mb-4 text-gray-700">Course Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Course Name..."
                    className="w-full border border-[#D9D9D9] p-2 rounded mb-4"
                />
                <h2 className="font-bold mb-4 text-gray-700">Course Description</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Course Description..."
                    className="w-full border border-[#D9D9D9] p-2 rounded mb-4"
                    rows={8}
                />
                <div className="flex justify-end mt-32">
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
