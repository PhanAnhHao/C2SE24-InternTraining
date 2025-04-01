import React, { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddLessonForm from "./AddLessonForm"; // Import component form thêm bài học

const colors = ["bg-teal-300", "bg-orange-200", "bg-blue-100", "bg-red-200"];

const LessonList = ({ lessons = [], onEdit, onDelete, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false); // Trạng thái bật/tắt form

    return (
        <div className="relative p-4">
            {/* Nút thêm bài học */}
            <div className="flex justify-end mb-4 mt-[-60px]">
                <button
                    onClick={() => setIsAdding(true)} // Khi bấm mở form
                    className="px-4 py-2 bg-green-500 text-white rounded shadow-md flex items-center gap-2
                    hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    <FontAwesomeIcon icon={faPlus}/>
                    Thêm bài học
                </button>
            </div>

            {/* Danh sách bài học */}
            {lessons.length === 0 ? (
                <p className="text-gray-500 italic text-center">Chưa có bài học nào.</p>
            ) : (
                lessons.map((lesson, index) => (
                    <div
                        key={lesson.id}
                        className={`flex justify-between items-center ${colors[index % colors.length]} 
                          p-4 rounded-lg shadow-md mb-3 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
                    >
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaBookOpen className="text-lg"/>
                            <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-gray-600">{lesson.duration}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(lesson.id)}
                                className="px-3 py-1 bg-yellow-400 text-white rounded shadow-md transition-transform transform
                                hover:bg-yellow-500 hover:scale-110"
                            >
                                <FontAwesomeIcon icon={faPencilAlt}/>
                            </button>
                            <button
                                onClick={() => onDelete(lesson.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded shadow-md transition-transform transform
                                hover:bg-red-600 hover:scale-110"
                            >
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Hiển thị modal khi isAdding = true */}
            {isAdding && <AddLessonForm onClose={() => setIsAdding(false)} onSave={onAdd} />}
        </div>
    );
};

export default LessonList;
