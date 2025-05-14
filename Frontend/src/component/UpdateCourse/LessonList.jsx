import CreateLessonForm from './CreateLesson/CreateLesson.jsx';
import { useState } from "react";
import LessonItem from './LessonItem';

const colors = ["teal-300", "orange-200", "blue-100", "red-200"];

const LessonList = ({ lessons = [], onAddLesson, onEditLesson, onDeleteLesson, editingLesson, onCancelEdit, onBack }) => {
    const [showAddLessonForm, setShowAddLessonForm] = useState(false);

    // Ánh xạ lessons để đảm bảo mỗi lesson có trường name
    const normalizedLessons = lessons.map((lesson, idx) => ({
        ...lesson,
        name: lesson.name || lesson.idLesson || `Lesson ${idx + 1}`,
        color: lesson.color || colors[idx % colors.length],
    }));

    const handleAddLesson = (newLesson) => {
        const newColorIndex = lessons.length % colors.length;
        const lessonWithColor = {
            ...newLesson,
            name: newLesson.name || newLesson.idLesson || `Lesson ${lessons.length + 1}`, // Đảm bảo name luôn có
            color: colors[newColorIndex],
        };
        onAddLesson(lessonWithColor); // Gọi onAddLesson để xử lý ngay lập tức
        setShowAddLessonForm(false);
    };

    const handleEditLesson = (index) => {
        onEditLesson(index);
        setShowAddLessonForm(true);
    };

    const handleDeleteLesson = (index) => {
        onDeleteLesson(index);
    };

    const handleCancel = () => {
        setShowAddLessonForm(false);
        onCancelEdit();
    };

    return (
        <div className="w-1/3 p-4 relative">
            <div className="flex items-center mb-4">
                <button
                    onClick={onBack}
                    className="mr-3 text-lg text-white px-6 rounded-lg bg-teal-400 hover:text-teal-600 flex items-center"
                >
                    <svg className="w-8 h-8 p-2 mr-1" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h2 className="text-lg font-bold">Lesson List</h2>
            </div>

            {/* Hiển thị danh sách lesson hoặc thông báo */}
            {normalizedLessons.length > 0 ? (
                normalizedLessons.map((lesson, idx) => (
                    <LessonItem
                        key={lesson._id || lesson.idLesson || idx} // Sử dụng _id hoặc idLesson làm key
                        lessonName={lesson.name} // Chỉ truyền name đã được ánh xạ
                        color={lesson.color}
                        onEdit={() => handleEditLesson(idx)}
                        onDelete={() => handleDeleteLesson(idx)}
                    />
                ))
            ) : (
                <div className="p-3 text-gray-500">Chưa có bài học. Vui lòng thêm bài học mới!</div>
            )}

            <div
                className="flex items-center justify-between p-3 rounded-lg mb-2 bg-gray-100 cursor-pointer"
                onClick={() => setShowAddLessonForm(true)}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <p className="text-sm font-medium">Add Lesson</p>
                </div>
            </div>

            {showAddLessonForm && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-2/3 h-auto overflow-y-auto">
                        <CreateLessonForm
                            onSubmit={(lesson) => {
                                if (editingLesson) {
                                    // Khi chỉnh sửa, giữ lại color cũ và gọi onAddLesson để xử lý cập nhật
                                    const updatedLesson = { ...lesson, color: editingLesson.lesson.color };
                                    onAddLesson(updatedLesson); // Gọi onAddLesson để xử lý cả thêm mới và chỉnh sửa
                                } else {
                                    handleAddLesson(lesson); // Thêm mới
                                }
                                setShowAddLessonForm(false);
                            }}
                            onCancel={handleCancel}
                            editingLesson={editingLesson}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonList;