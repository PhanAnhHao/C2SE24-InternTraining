import React, { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "notistack";
import AddLessonForm from "./AddLessonForm";
import LessonDetail from "./LessonDetail.jsx";
import axios from "axios";

const colors = ["bg-teal-300", "bg-orange-200", "bg-blue-100", "bg-red-200"];

const LessonList = ({ courseId, lessons = [], onDelete: parentOnDelete, onAdd, onBack }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [viewingLessonId, setViewingLessonId] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (lessonId) => {
        const confirm = window.confirm("Are you sure you want to delete this lesson?");
        if (!confirm) return;

        try {
            await axios.delete(`http://localhost:5000/lessons/${lessonId}`);
            enqueueSnackbar("Lesson deleted successfully!", { variant: "success" });
            if (typeof parentOnDelete === "function") parentOnDelete(lessonId);
        } catch (error) {
            console.error("Delete lesson failed:", error);
            enqueueSnackbar("Failed to delete the lesson!", { variant: "error" });
        }
    };

    return (
        <div className="relative p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Lesson List</h2>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4FD1C5] text-white rounded-md shadow-md hover:bg-teal-500"
                >
                    Go Back
                </button>
            </div>

            {lessons.length === 0 ? (
                <p className="text-gray-500 italic text-center">No lessons available.</p>
            ) : (
                lessons.map((lesson, index) => (
                    <div
                        key={lesson._id}
                        className={`flex justify-between items-center ${colors[index % colors.length]} 
                          p-4 rounded-lg shadow-md mb-3 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
                    >
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaBookOpen className="text-lg" />
                            <span className="font-medium">{lesson.name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">Status: {lesson.status}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewingLessonId(lesson._id)}
                                className="px-3 py-1 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                            >
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                                onClick={() => handleDelete(lesson._id)}
                                className="px-3 py-1 bg-red-500 text-white rounded shadow-md transition-transform transform hover:bg-red-600 hover:scale-110"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Add lesson form */}
            {isAdding && (
                <AddLessonForm
                    courseId={courseId}
                    onClose={() => setIsAdding(false)}
                    onSave={onAdd}
                />
            )}

            {/* Lesson detail */}
            {viewingLessonId && (
                <div className="mt-6">
                    <LessonDetail
                        lessonId={viewingLessonId}
                        onClose={() => setViewingLessonId(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default LessonList;
