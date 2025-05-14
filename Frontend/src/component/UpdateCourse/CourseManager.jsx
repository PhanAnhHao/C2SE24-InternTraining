import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import LessonList from "./LessonList";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const CourseManager = () => {
    const [lessons, setLessons] = useState([]);
    const [initialLessons, setInitialLessons] = useState([]); // Lưu danh sách ban đầu
    const [editingLesson, setEditingLesson] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (courseId) {
            const fetchCourse = async () => {
                try {
                    // Lấy thông tin khóa học
                    const courseResponse = await axios.get(`http://localhost:5000/courses/${courseId}`);
                    setCourseData(courseResponse.data);

                    // Lấy danh sách bài học
                    const lessonsResponse = await axios.get(`http://localhost:5000/lessons/by-course/${courseId}`);
                    console.log("Dữ liệu lesson từ API:", lessonsResponse.data);
                    const lessonsWithColor = lessonsResponse.data.map((lesson, idx) => ({
                        ...lesson,
                        name: lesson.name || `Lesson ${idx + 1}`,
                        color: colors[idx % colors.length],
                    }));
                    setLessons(lessonsWithColor);
                    setInitialLessons(lessonsWithColor); // Lưu danh sách ban đầu
                } catch (error) {
                    enqueueSnackbar("Không thể lấy dữ liệu khóa học hoặc bài học.", { variant: "error" });
                }
            };
            fetchCourse();
        } else {
            setLessons([]);
            setInitialLessons([]);
            setCourseData(null);
        }
    }, [courseId, enqueueSnackbar]);

    const handleAddLesson = (newLesson) => {
        if (editingLesson !== null) {
            const updatedLessons = lessons.map((lesson, idx) =>
                idx === editingLesson.index ? { ...newLesson, color: lesson.color } : lesson
            );
            setLessons(updatedLessons);
            setEditingLesson(null);
        } else {
            const newColorIndex = lessons.length % colors.length;
            setLessons([...lessons, { ...newLesson, color: colors[newColorIndex] }]);
        }
    };

    const handleEditLesson = (index) => {
        setEditingLesson({ index, lesson: lessons[index] });
    };

    const handleDeleteLesson = (index) => {
        // Chỉ xóa trên client, không gửi DELETE ngay
        const filteredLessons = lessons.filter((_, idx) => idx !== index);
        setLessons(filteredLessons);
        if (editingLesson && editingLesson.index === index) {
            setEditingLesson(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingLesson(null);
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
            <CourseForm
                lessons={lessons}
                initialLessons={initialLessons} // Truyền danh sách ban đầu
                courseData={courseData}
                courseId={courseId}
            />
        </div>
    );
};

const colors = ["teal-300", "orange-200", "blue-100", "red-200"];

export default CourseManager;