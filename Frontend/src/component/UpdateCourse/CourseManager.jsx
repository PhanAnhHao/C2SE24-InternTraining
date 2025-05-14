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

    const handleAddLesson = async (newLesson) => {
        try {
            const role = localStorage.getItem('role');
            let businessId = null;
            if (role === "Business") {
                businessId = localStorage.getItem('businessId');
                if (!businessId) {
                    enqueueSnackbar("Business ID not found. Please log in lại.", { variant: "error" });
                    return;
                }
            }

            if (editingLesson !== null) {
                // Cập nhật bài học khi chỉnh sửa
                const lessonToUpdate = {
                    ...newLesson,
                    _id: lessons[editingLesson.index]._id,
                    businessId: businessId || undefined,
                };
                const response = await axios.put(`http://localhost:5000/lessons/${lessonToUpdate._id}`, lessonToUpdate);
                const updatedLessons = lessons.map((lesson, idx) =>
                    idx === editingLesson.index ? { ...response.data, color: lesson.color } : lesson
                );
                setLessons(updatedLessons);
                setEditingLesson(null);
                enqueueSnackbar("Bài học được cập nhật thành công!", { variant: "success" });
            } else {
                // Thêm bài học mới
                const lessonToCreate = {
                    idLesson: newLesson.idLesson, // Đảm bảo gửi idLesson từ CreateLessonForm
                    idCourse: courseId, // Đổi từ courseId thành idCourse để khớp với API
                    name: newLesson.name,
                    content: newLesson.content || "",
                    linkVideo: newLesson.linkVideo || "",
                    status: newLesson.status || "draft",
                    businessId: businessId || undefined,
                };
                const response = await axios.post(`http://localhost:5000/lessons`, lessonToCreate);
                const newColorIndex = lessons.length % colors.length;
                const newLessonWithColor = { ...response.data, color: colors[newColorIndex] };
                setLessons([...lessons, newLessonWithColor]);
                enqueueSnackbar("Bài học được thêm thành công!", { variant: "success" });
            }
        } catch (error) {
            enqueueSnackbar("Lỗi khi lưu bài học. Vui lòng thử lại.", { variant: "error" });
        }
    };

    const handleEditLesson = (index) => {
        setEditingLesson({ index, lesson: lessons[index] });
    };

    const handleDeleteLesson = async (index) => {
        if (window.confirm("Bạn có chắc muốn xóa bài học này?")) {
            try {
                const lessonId = lessons[index]._id;
                await axios.delete(`http://localhost:5000/lessons/${lessonId}`);
                const filteredLessons = lessons.filter((_, idx) => idx !== index);
                setLessons(filteredLessons);
                if (editingLesson && editingLesson.index === index) {
                    setEditingLesson(null);
                }
                enqueueSnackbar("Bài học được xóa thành công!", { variant: "success" });
            } catch (error) {
                enqueueSnackbar("Lỗi khi xóa bài học. Vui lòng thử lại.", { variant: "error" });
            }
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
                initialLessons={initialLessons}
                courseData={courseData}
                courseId={courseId}
            />
        </div>
    );
};

const colors = ["teal-300", "orange-200", "blue-100", "red-200"];

export default CourseManager;