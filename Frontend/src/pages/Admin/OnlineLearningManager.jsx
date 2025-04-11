import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChalkboardTeacher } from "react-icons/fa";
import LessonList from "../../../src/component/Admin/ManageOnlineLearning/LessionList.jsx";
import Table from "../../../src/component/Admin/ManageOnlineLearning/Table.jsx";
import StudentProgress from "../../../src/component/Admin/ManageOnlineLearning/StudentProgress.jsx";

const OnlineLearningManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [view, setView] = useState("table");
    const [lessons, setLessons] = useState([]);

    // Gọi API lấy danh sách khóa học
    useEffect(() => {
        axios.get("http://localhost:5000/courses")
            .then(response => {
                console.log("Courses:", response.data);
                setCourses(response.data);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    // Gọi API lấy tất cả bài học (một lần khi vào "lessons")
    useEffect(() => {
        const fetchLessons = async () => {
            if (view === "lessons") {
                try {
                    const res = await axios.get("http://localhost:5000/lessons");
                    console.log("Lessons:", res.data);
                    setLessons(res.data); // lưu toàn bộ lessons vào state
                } catch (error) {
                    console.error("Error fetching lessons:", error);
                }
            }
        };

        fetchLessons();
    }, [view]);

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

    const handleEditLesson = (lessonId) => {
        console.log("Edit lesson", lessonId);
    };

    const handleDeleteLesson = (lessonId) => {
        console.log("Delete lesson", lessonId);
    };

    const handleAddLesson = () => {
        console.log("Add new lesson");
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
                        <span className="text-gray-700"> / {selectedCourseData.info}</span>
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
