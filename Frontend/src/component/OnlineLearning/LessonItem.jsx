import { FaPlayCircle } from "react-icons/fa";

const LessonItem = ({ lesson, selectedLesson, index, onSelect, isSelected }) => {
    const status = lesson.progress?.status || "not_started";

    const getStatusStyles = () => {
        if (isSelected) {
            return "bg-teal-600 text-white shadow-md scale-105";
        }
        switch (status) {
            case "completed":
                return "bg-teal-400 text-white hover:bg-teal-500";
            case "in_progress":
                return "bg-yellow-200 text-gray-800 hover:bg-yellow-300";
            case "not_started":
            default:
                return "bg-gray-200 text-gray-600 hover:bg-gray-300";
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ease-in-out ${getStatusStyles()}`}
        >
            <div className="flex items-center space-x-3">
                <FaPlayCircle
                    className={`text-lg ${isSelected || status === "completed" ? "text-white" : status === "in_progress" ? "text-gray-800" : "text-gray-600"}`}
                />
                <span
                    className={`font-medium ${isSelected || status === "completed" ? "text-white" : status === "in_progress" ? "text-gray-800" : "text-gray-600"}`}
                >
          {index + 1}. {lesson.name}
        </span>
            </div>
            <span
                className={`text-xs ${isSelected || status === "completed" ? "text-gray-200" : status === "in_progress" ? "text-gray-700" : "text-gray-500"}`}
            >
        {/* Uncomment if you have duration data */}
                {/* {lesson.duration} */}
      </span>
        </div>
    );
};

export default LessonItem;