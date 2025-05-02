import { useState } from "react";
import CourseForm from "./CourseForm";
import LessonList from "./LessonList";
import {useNavigate} from "react-router-dom";
const CourseManager = () => {
    const [lessons, setLessons] = useState([]);
    const [editingLesson, setEditingLesson] = useState(null); // Lưu lesson đang chỉnh sửa và chỉ số
    const navigate = useNavigate();
    const handleAddLesson = (newLesson) => {
        if (editingLesson !== null) {
            // Nếu đang chỉnh sửa, cập nhật lesson thay vì thêm mới
            const updatedLessons = lessons.map((lesson, idx) =>
                idx === editingLesson.index ? newLesson : lesson
            );
            setLessons(updatedLessons);
            setEditingLesson(null); // Thoát chế độ chỉnh sửa
        } else {
            // Thêm lesson mới
            setLessons([...lessons, newLesson]);
        }
    };

    const handleEditLesson = (index) => {
        // Lưu thông tin lesson cần chỉnh sửa
        setEditingLesson({ index, lesson: lessons[index] });
    };

    const handleDeleteLesson = (index) => {
        const filteredLessons = lessons.filter((_, idx) => idx !== index);
        setLessons(filteredLessons);
        if (editingLesson && editingLesson.index === index) {
            setEditingLesson(null); // Thoát chế độ chỉnh sửa nếu lesson bị xóa
        }
    };

    const handleCancelEdit = () => {
        setEditingLesson(null); // Thoát chế độ chỉnh sửa
    };

    return (
        <div className="flex">
            <LessonList
                lessons={lessons}
                onAddLesson={handleAddLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
                editingLesson={editingLesson}
                onCancelEdit={handleCancelEdit}
                onBack={() => navigate(-1)}
            />
            <CourseForm lessons={lessons} />
        </div>
    );
};

export default CourseManager;