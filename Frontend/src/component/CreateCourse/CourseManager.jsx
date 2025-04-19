import { useState } from "react";
import CourseForm from "./CourseForm";
import LessonList from "./LessonList";

const CourseManager = () => {

    const [lessons, setLessons] = useState([
        { title: "Lesson 01: Introduction about XD", duration: "30 mins" },
        { title: "Lesson 02: Basics of XD Design", duration: "30 mins"},
        { title: "Lesson 03: Advanced XD Features", duration: "30 mins" },
        { title: "Lesson 04: XD Prototyping Tips", duration: "30 mins" },
    ]);

    const handleAddLesson = (newLesson) => {
        setLessons([...lessons, newLesson]);
    };

    const handleEditLesson = (index, updatedLesson) => {
        const updatedLessons = lessons.map((lesson, idx) =>
            idx === index ? updatedLesson : lesson
        );
        setLessons(updatedLessons);
    };

    const handleDeleteLesson = (index) => {
        const filteredLessons = lessons.filter((_, idx) => idx !== index);
        setLessons(filteredLessons);
    };

    return (
        <div className="flex">
            <LessonList
                lessons={lessons}
                onAddLesson={handleAddLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
            />
            <CourseForm lessons={lessons} />
        </div>
    );
};

export default CourseManager;
