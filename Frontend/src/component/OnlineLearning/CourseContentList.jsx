import { useState } from "react";
import LessonItem from "./LessonItem";
import { useSelector } from "react-redux";

const CourseContentList = ({

                               setSelectedLesson,
                               selectedLesson,
                               currentLessonIndex,
                               setCurrentLessonIndex,
                               contentRef,
                           }) => {
    const { lessons, singleLessonData, loading, error } = useSelector((state) => state.lessons); // Sửa state.lessons thành state.lesson

    const handleSelectLesson = (lesson) => {
        const index = lessons.findIndex((l) => l._id === lesson._id);
        setCurrentLessonIndex(index);
        setSelectedLesson(lesson);

        setTimeout(() => {
            contentRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    return (
        <div className="text-sm w-1/4 px-4 pt-4 bg-[#F3FAFF] min-h-screen border-l border-gray-300">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Course content</h3>
            <ul className="space-y-2">
                {lessons.map((lesson, index) => (
                    <LessonItem
                        key={lesson._id}
                        lesson={lesson}
                        selectedLesson={selectedLesson}
                        index={index}
                        onSelect={() => handleSelectLesson(lesson)}
                        isSelected={selectedLesson && lesson._id === selectedLesson._id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default CourseContentList;