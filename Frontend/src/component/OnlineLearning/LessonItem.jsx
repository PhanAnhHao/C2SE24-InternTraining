import { FaPlayCircle, FaLock } from "react-icons/fa";

const LessonItem = ({ lesson, onSelect, isSelected }) => {
    const isActive = lesson.status === "active";

    return (
        <div
            onClick={isActive ? onSelect : null}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                isSelected
                    ? "bg-teal-600 text-white shadow-md scale-105"
                    : isActive
                        ? "bg-teal-400 hover:bg-teal-600 text-white"
                        : "bg-teal-100 cursor-not-allowed text-gray-600"
            }`}
        >
            <div className="flex items-center space-x-3">
                {isActive ? (
                    <FaPlayCircle className={`text-lg ${isSelected ? "text-white" : "text-white"}`} />
                ) : (
                    <FaLock className="text-gray-400 text-lg" />
                )}
                <span className={`font-medium ${isSelected ? "text-white" : isActive ? "text-white" : "text-gray-600"}`}>
                    {lesson.index}. {lesson.title}
                </span>
            </div>
            <span className={`text-xs ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                {lesson.duration}
            </span>
        </div>
    );
};

export default LessonItem;