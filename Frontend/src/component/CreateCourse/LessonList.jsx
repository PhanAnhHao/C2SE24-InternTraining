import CreateLessonForm from './CreateLesson/CreateLesson.jsx'; // Import CreateLessonForm
import { useState } from "react";
import LessonItem from './LessonItem';

const colors = ["teal-300", "orange-200", "blue-100", "red-200"];

const LessonList = ({ lessons = [], onAddLesson, onEditLesson, onDeleteLesson }) => {
    const [showAddLessonForm, setShowAddLessonForm] = useState(false);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(null); // Để theo dõi bài học đang được chỉnh sửa

    const handleAddLesson = (newLesson) => {
        onAddLesson(newLesson); // Gọi hàm từ prop để thêm bài học
        setShowAddLessonForm(false); // Ẩn form sau khi thêm
    };

    const handleEditLesson = (index) => {
        setCurrentLessonIndex(index);
        setShowAddLessonForm(true); // Hiển thị form để chỉnh sửa
    };

    const handleDeleteLesson = (index) => {
        onDeleteLesson(index); // Gọi hàm từ prop để xóa bài học
    };

    const handleCancel = () => {
        setShowAddLessonForm(false); // Ẩn form khi hủy
        setCurrentLessonIndex(null); // Đặt lại chỉ số bài học đang chỉnh sửa
    };

    return (
        <div className="w-1/3 p-4 relative">
            <h2 className="text-lg font-bold mb-4">Lesson List</h2>
            {lessons.map((lesson, idx) => (
                <LessonItem
                    key={idx}
                    title={lesson.title}
                    color={lesson.color || colors[idx % colors.length]} // Sử dụng màu sắc từ bài học hoặc màu mặc định
                    onEdit={() => handleEditLesson(idx)}
                    onDelete={() => handleDeleteLesson(idx)}
                />
            ))}
            <div
                className="flex items-center justify-between p-3 rounded-lg mb-2 bg-gray-100 cursor-pointer"
                onClick={() => {
                    setCurrentLessonIndex(null); // Đảm bảo không có bài học nào được chọn khi thêm mới
                    setShowAddLessonForm(true);
                }}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <p className="text-sm font-medium">Add Lesson</p>
                </div>
            </div>

            {/* Hiển thị CreateLessonForm ở giữa màn hình */}
            {showAddLessonForm && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-2/3 h-auto overflow-y-auto">
                        <CreateLessonForm
                            onSubmit={(lesson) => {
                                if (currentLessonIndex !== null) {
                                    // Nếu đang chỉnh sửa, gọi hàm chỉnh sửa
                                    onEditLesson(currentLessonIndex, lesson);
                                } else {
                                    // Nếu thêm mới, gọi hàm thêm
                                    const newColorIndex = lessons.length % colors.length; // Tính chỉ số màu sắc
                                    const lessonWithColor = { ...lesson, color: colors[newColorIndex] }; // Thêm màu sắc vào bài học mới
                                    handleAddLesson(lessonWithColor);
                                }
                            }}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonList;
