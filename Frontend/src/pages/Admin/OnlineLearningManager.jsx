import React, { useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import LessonList from "../../../src/component/Admin/ManageOnlineLearning/LessionList.jsx";
import Table from "../../../src/component/Admin/ManageOnlineLearning/Table.jsx";

 const courses = [
    { id: 1, title: "React Basics", category: "Frontend", duration: "4h", instructor: "John Doe" },
    { id: 2, title: "Advanced JavaScript", category: "Programming", duration: "6h", instructor: "Jane Smith" },
    { id: 3, title: "CSS Mastery", category: "Frontend", duration: "3h 30m", instructor: "Alice Johnson" },
    { id: 4, title: "Node.js Fundamentals", category: "Backend", duration: "5h", instructor: "Bob Martin" },
];

const lessons = {
    1: [
        { id: 101, title: "Introduction to React", duration: "30 mins" },
        { id: 102, title: "React Components", duration: "45 mins" },
        { id: 103, title: "Introduction to React", duration: "30 mins" },
        { id: 104, title: "React Components", duration: "45 mins" },
        { id: 105, title: "Introduction to React", duration: "30 mins" },
        { id: 106, title: "React Components", duration: "45 mins" },
        { id: 107, title: "Introduction to React", duration: "30 mins" },
        { id: 108, title: "React Components", duration: "45 mins" },
    ],
    2: [
        { id: 201, title: "Closures in JavaScript", duration: "1h" },
        { id: 202, title: "Async/Await", duration: "1h 30 mins" },
    ],
    3: [
        { id: 301, title: "CSS Grid and Flexbox", duration: "50 mins" },
        { id: 302, title: "Responsive Design", duration: "40 mins" },
    ],
    4: [
        { id: 401, title: "Introduction to Node.js", duration: "1h" },
        { id: 402, title: "Building REST APIs", duration: "2h" },
    ],
};


const OnlineLearningManager = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const selectedCourseData = courses.find(course => course.id === selectedCourse) || null;

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaChalkboardTeacher className="text-[#4FD1C5] mr-3 text-3xl" />
                <span>
                    <span
                        className=" cursor-pointer hover:underline"
                        onClick={() => setSelectedCourse(null)}
                    >
                        Manage Online Learning
                    </span>
                    {selectedCourseData && <span className="text-gray-700"> / {selectedCourseData.title}</span>}
                </span>
            </h1>

            {!selectedCourse ? (
                <Table courses={courses} onSelectCourse={setSelectedCourse} />
            ) : (
                <LessonList lessons={lessons[selectedCourse] || []} />
            )}
        </div>
    );
};


export default OnlineLearningManager;
