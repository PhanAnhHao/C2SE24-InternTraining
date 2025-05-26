import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Education = ({ education }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    const renderStars = (avgRating) => {
        const roundedRating = Math.round(avgRating);
        const totalStars = 5;
        const stars = [];

        for (let i = 0; i < roundedRating; i++) {
            stars.push(<span key={`filled-${i}`} className="text-yellow-400">★</span>);
        }
        for (let i = roundedRating; i < totalStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
        }

        return stars;
    };

    // Hàm xử lý khi nhấp vào "View Course"
    const handleViewCourse = (courseId) => {
        navigate(`/course/${courseId}`); // Điều hướng đến /course/:id
    };

    return (
        <div className="px-4 pb-4">
            <h3 className="text-lg font-semibold mb-4">Educational Background</h3>
            {education && education.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                    {education.map((edu, index) => (
                        <div key={index} className="p-4 border rounded shadow-sm bg-gray-50">
                            <p className="text-base font-semibold text-gray-800 mb-1">{edu.courseName}</p>
                            <p className="text-sm text-gray-600 mb-1"><strong>Provider:</strong> {edu.provider}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Rating:</strong> {edu.avgRating.toFixed(1)} / 5
                                <span className="ml-1">{renderStars(edu.avgRating)}</span>
                                <span className="ml-1">({edu.ratingsCount} reviews)</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Grade:</strong> {edu.grade}</p>
                            {edu.id && (
                                <button
                                    onClick={() => handleViewCourse(edu.id)} // Gọi hàm điều hướng với course ID
                                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                                >
                                    View Course
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No educational background available.</p>
            )}
        </div>
    );
};

export default Education;