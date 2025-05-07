import React, { useState, useEffect } from 'react';
import CourseCard from "./CourseCard.jsx";

const YourCourse = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const coursesPerPage = 16;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/courses/');
                const data = await response.json();
                const transformedCourses = data.map(course => ({
                    id: course._id,
                    title: course.infor,
                    category: "programming",
                    avgRating: course.avgRating,
                    instructor: "Unknown",
                    image: "/img/placeholder.jpg",
                    description: course.infor,
                    price: 400,
                    oldPrice: 500,
                    ratingsCount: course.ratingsCount,
                    language: course.languageID.name
                }));
                setCourses(transformedCourses);
                setFilteredCourses(transformedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Reset to page 1 whenever filteredCourses changes (e.g., after a search)
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCourses]);

    // Calculate the courses to display on the current page
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Calculate total pages
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    // Handle page navigation
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="px-[5%] py-10 bg-white">
                <h2 className="text-2xl font-bold mb-4">Course List</h2>
                <div
                    className={`w-full ${currentCourses.length >= 4 ? 'grid grid-cols-4 justify-center gap-4' : 'flex flex-wrap gap-4'}`}>
                    {currentCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {filteredCourses.length > coursesPerPage && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YourCourse;