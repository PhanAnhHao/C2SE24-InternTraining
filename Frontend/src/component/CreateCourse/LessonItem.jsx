import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const LessonItem = ({ title, color, onEdit, onDelete }) => {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg mb-2 bg-${color}`}>
            <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
                </svg>
                <p className="text-sm font-medium">{title}</p>
            </div>
            <div  className="flex gap-2">
                <button onClick={onEdit} className="mr-2 text-gray-600">
                    <FontAwesomeIcon icon={faEdit} />
                </button>


                <button onClick={onDelete} className="mr-2 text-gray-600">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

export default LessonItem;