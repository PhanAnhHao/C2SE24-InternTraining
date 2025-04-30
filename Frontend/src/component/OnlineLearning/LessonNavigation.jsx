import React from "react";

const LessonNavigation = ({ currentLessonIndex, totalLessons, onPrevious, onNext }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 py-2 flex justify-center space-x-4">
            <button
                onClick={onPrevious}
                disabled={currentLessonIndex === 0}
                className={`px-4 py-2 w-40 rounded-full text-sm font-medium flex items-center justify-center space-x-2 ${
                    currentLessonIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span>Previous Lesson</span>
            </button>
            <button
                onClick={onNext}
                disabled={currentLessonIndex === totalLessons - 1}
                className={`px-4 py-2 w-40 rounded-full text-sm font-medium flex items-center justify-center space-x-2 ${
                    currentLessonIndex === totalLessons - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
            >
                <span>Next Lesson</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
    );
};

export default LessonNavigation;