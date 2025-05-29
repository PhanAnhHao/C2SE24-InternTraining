import React, { useState, useEffect } from 'react';
import CourseCard from "../../common/CourseCard.jsx";
import SearchBar from '../Search/SearchBar.jsx';

const RecommendList = () => {
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
                    image: course.image || "https://placehold.co/150", // Sử dụng course.image từ API, fallback nếu không có
                    description: course.infor,
                    ratingsCount: course.ratingsCount,
                    language: course.languageID.name,
                    creator: course.businessId?.userId?.userName || "Unknown Creator",
                    AvatarCreator: course.businessId?.userId?.avatar || "https://placehold.co/40"
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

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCourses]);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
            <SearchBar courses={courses} onSearch={setFilteredCourses}/>
            <div className="px-4 sm:px-6 md:px-8 lg:px-[5%] py-10 bg-gray-50 min-h-screen">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Course List</h2>
                <div
                    className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center"
                >
                    {currentCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </div>

                {filteredCourses.length > coursesPerPage && (
                    <div
                        className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-700 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendList;