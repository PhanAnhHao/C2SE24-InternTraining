import { FaPlayCircle, FaLock } from "react-icons/fa";

const LessonItem = ({ lesson, selectedLesson, index, onSelect, isSelected }) => {
    console.log("selectedLesson ", selectedLesson);
    const isActive = lesson._id === selectedLesson?._id;

    return (
        <div
            onClick={onSelect}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${isSelected
                ? "bg-teal-600 text-white shadow-md scale-105"
                : isActive
                    ? "bg-teal-400 hover:bg-teal-600 text-white"
                    : "bg-teal-100 cursor-not-allowed text-gray-600"
                }`}
        >
            <div className="flex items-center space-x-3">
                {/* {isActive ? (
                    <FaPlayCircle className={`text-lg ${isSelected ? "text-white" : "text-white"}`} />
                ) : (
                    <FaLock className="text-gray-400 text-lg" />
                )} */}
                <FaPlayCircle className={`text-lg ${isSelected ? "text-white" : "text-white"}`} />
                <span className={`font-medium ${isSelected ? "text-white" : isActive ? "text-white" : "text-gray-600"}`}>
                    {index + 1}. {lesson.name}
                </span>
            </div>
            <span className={`text-xs ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                {/* {lesson.duration} */}
            </span>
        </div>
    );
};

export default LessonItem;