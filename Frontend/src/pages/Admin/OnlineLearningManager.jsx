import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChalkboardTeacher } from "react-icons/fa";
import LessonList from "../../../src/component/Admin/ManageOnlineLearning/LessionList.jsx";
import Table from "../../../src/component/Admin/ManageOnlineLearning/Table.jsx";
import StudentProgress from "../../../src/component/Admin/ManageOnlineLearning/StudentProgress.jsx";
import { useSnackbar } from "notistack"; // Thêm useSnackbar

const OnlineLearningManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [view, setView] = useState("table");
    const [lessons, setLessons] = useState([]);

    const { enqueueSnackbar } = useSnackbar(); // Thêm enqueueSnackbar

    // const emitOnlineLearningUpdate = () => {
    //     const event = new CustomEvent('onlineLearningUpdated');
    //     window.dispatchEvent(event);
    // }; 
    const emitOnlineLearningUpdate = () => {
        const event = new CustomEvent('onlineLearningUpdated');
        window.dispatchEvent(event);
    };

    // Gọi API lấy danh sách khóa học
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const role = localStorage.getItem('role');
                let url = "http://localhost:5000/courses";

                // Nếu role là Business, lấy businessId và thêm vào query
                if (role === "Business") {
                    const businessId = localStorage.getItem('businessId');
                    if (!businessId) {
                        enqueueSnackbar("Business ID not found. Please log in again.", { variant: "error" });
                        return;
                    }
                    url = `http://localhost:5000/courses/business/${businessId}`;
                }

                const response = await axios.get(url);
                let courseData = [];

                // Chuẩn hóa dữ liệu: lấy mảng khóa học từ API
                if (role === "Business") {
                    courseData = response.data.courses || [];
                } else {
                    courseData = response.data || [];
                }

                console.log("Courses:", courseData);
                setCourses(courseData);
            } catch (error) {
                console.error("Error fetching courses:", error);
                enqueueSnackbar("Failed to fetch courses.", { variant: "error" }); // Thêm thông báo lỗi
            }
        };
        fetchCourses();
    }, [enqueueSnackbar]);

    // Gọi API lấy tất cả bài học (một lần khi vào "lessons")
    useEffect(() => {
        const fetchLessons = async () => {
            if (view === "lessons") {
                try {
                    const res = await axios.get("http://localhost:5000/lessons");
                    console.log("Lessons:", res.data);
                    setLessons(res.data); // Lưu toàn bộ lessons vào state
                } catch (error) {
                    console.error("Error fetching lessons:", error);
                    enqueueSnackbar("Failed to fetch lessons.", { variant: "error" }); // Thêm thông báo lỗi
                }
            }
        };

        fetchLessons();
    }, [view, enqueueSnackbar]); // Thêm enqueueSnackbar vào dependency

    const selectedCourseData = courses.find(course => course._id === selectedCourse) || null;

    const handleSelectCourse = (courseId) => {
        setSelectedCourse(courseId);
        setView("lessons");
    };

    const handleSelectStudentList = (courseId) => {
        setSelectedCourse(courseId);
        setView("students");
    };

    const handleBack = () => {
        setSelectedCourse(null);
        setView("table");
    };

    const filteredLessons = lessons.filter(
        (lesson) => lesson.idCourse?._id === selectedCourse
    );

    const handleEditLesson = async (lessonId) => {
        console.log("Edit lesson", lessonId);
        // After successful edit
        emitOnlineLearningUpdate();
    };

    const handleDeleteLesson = async (lessonId) => {
        console.log("Delete lesson", lessonId);
        // After successful delete
        emitOnlineLearningUpdate();
    };

    const handleAddLesson = async () => {
        console.log("Add new lesson");
        // After successful add
        emitOnlineLearningUpdate();
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaChalkboardTeacher className="text-[#4FD1C5] mr-3 text-3xl" />
                <span>
                    <span className="cursor-pointer hover:underline" onClick={handleBack}>
                        Manage Online Learning
                    </span>
                    {selectedCourseData && view !== "table" && (
                        <span className="text-gray-700"> / {selectedCourseData.infor}</span> // Sửa "info" thành "infor" cho đúng với dữ liệu
                    )}
                </span>
            </h1>

            {view === "table" && (
                <Table
                    courses={courses}
                    onSelectCourse={handleSelectCourse}
                    onSelectStudentList={handleSelectStudentList}
                />
            )}

            {view === "lessons" && (
                <LessonList
                    courseId={selectedCourse}
                    lessons={filteredLessons}
                    onBack={handleBack}
                    onEdit={handleEditLesson}
                    onDelete={handleDeleteLesson}
                    onAdd={handleAddLesson}
                />
            )}

            {view === "students" && (
                <StudentProgress
                    courseId={selectedCourse}
                    onBack={handleBack}
                />
            )}
        </div>
    );
};

export default OnlineLearningManager;