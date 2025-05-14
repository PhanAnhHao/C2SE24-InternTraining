import CreateLessonForm from './CreateLesson/CreateLesson.jsx';
import { useState } from "react";
import LessonItem from './LessonItem';

const colors = ["teal-300", "orange-200", "blue-100", "red-200"];

const LessonList = ({ lessons = [], onAddLesson, onEditLesson, onDeleteLesson, editingLesson, onCancelEdit, onBack }) => {
    const [showAddLessonForm, setShowAddLessonForm] = useState(false);

    const handleAddLesson = (newLesson) => {
        const newColorIndex = lessons.length % colors.length;
        const lessonWithColor = { ...newLesson, color: colors[newColorIndex] };
        onAddLesson(lessonWithColor);
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

            {lessons.map((lesson, idx) => (
                <LessonItem
                    key={idx}
                    lessonName syndication
                    lessonName={lesson.name}
                    color={lesson.color || colors[idx % colors.length]}
                    onEdit={() => handleEditLesson(idx)}
                    onDelete={() => handleDeleteLesson(idx)}
                />
            ))}
            <div
                className="flex items-center justify-between p-3 rounded-lg mb-2 bg-gray-100 cursor-pointer"
                onClick={() => {
                    setShowAddLessonForm(true);
                }}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
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
                                // Use onAddLesson for both creating and editing
                                const lessonWithColor = editingLesson
                                    ? { ...lesson, color: editingLesson.lesson.color }
                                    : { ...lesson, color: colors[lessons.length % colors.length] };
                                onAddLesson(lessonWithColor);
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