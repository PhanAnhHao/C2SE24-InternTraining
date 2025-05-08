// components/SectionItem.jsx
import { useState } from "react";
import LessonItem from "./LessonItem";

const SectionItem = ({ section }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full font-semibold text-left py-2"
            >
                <span>{section.index}. {section.title}</span>
                <span className="text-gray-500 text-xs">{section.completedLessons}/{section.totalLessons} | {section.totalTime}</span>
            </button>

            {isOpen && (
                <div className="mt-2 ml-2 space-y-2">
                    {section.lessons.length > 0 ? (
                        section.lessons.map((lesson) => (
                            <LessonItem key={lesson.id} lesson={lesson} />
                        ))
                    ) : (
                        <p className="text-gray-400 italic ml-4">Chưa có bài học</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionItem;