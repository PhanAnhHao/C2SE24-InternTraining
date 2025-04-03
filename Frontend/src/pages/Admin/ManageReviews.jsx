import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import ReviewList from "../../../src/component/Admin/ManageReviews/ReviewList.jsx";
import Table from "../../../src/component/Admin/ManageReviews/Table.jsx";
import Filter from "../../../src/component/Admin/ManageReviews/Filter";  // Import bộ lọc

const courses = [
    { id: 1, title: "React Basics", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 4.5, totalReviews: 120 },
    { id: 2, title: "Advanced JavaScript", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 3.8, totalReviews: 85 },
    { id: 3, title: "CSS Mastery", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 5.0, totalReviews: 50 },
    { id: 4, title: "Node.js Fundamentals", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 4.2, totalReviews: 95 },
];

const reviews = {
    1: [
        { id: 101, user: "Alice", nameCourse:"React Basics",  rating: 4, comment: "Khóa học tốt nhưng cần thêm bài tập thực hành.", date: "28/03/2025", adminResponse: "" },
        { id: 102, user: "Bob", nameCourse:"React Basics",  rating: 5, comment: "Cực kỳ hữu ích, giảng viên dạy dễ hiểu!", date: "25/03/2025", adminResponse: "" },
    ],
    2: [
        { id: 201, user: "Charlie", nameCourse:"React Basics",  rating: 2, comment: "Nội dung còn sơ sài, nên bổ sung thêm.", date: "22/03/2025", adminResponse: "" },
    ],
    3: [
        { id: 301, user: "David", nameCourse:"React Basics",  rating: 5, comment: "Rất hay và dễ hiểu!", date: "20/03/2025", adminResponse: "" },
    ],
    4: [
        { id: 401, user: "Eva",  nameCourse:"React Basics", rating: 4, comment: "Học xong có thể áp dụng thực tế ngay!", date: "18/03/2025", adminResponse: "" },
    ],
};

const ManageReviews = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [reviewsData, setReviewsData] = useState(reviews);
    const [filters, setFilters] = useState({
        rating: "",
        user: "",
        date: "",
    });
    const selectedCourseData = courses.find(course => course.id === selectedCourse) || null;

    const handleDeleteReview = (courseId, reviewId) => {
        const updatedReviews = { ...reviewsData };
        updatedReviews[courseId] = updatedReviews[courseId].filter(review => review.id !== reviewId);
        setReviewsData(updatedReviews);
    };

    const handleAddResponse = (courseId, reviewId, response) => {
        const updatedReviews = { ...reviewsData };
        const reviewIndex = updatedReviews[courseId].findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
            updatedReviews[courseId][reviewIndex].adminResponse = response;
        }
        setReviewsData(updatedReviews);
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: value,
        }));
    };

    const filteredReviews = (courseId) => {
        let reviewsList = reviewsData[courseId] || [];

        // Apply filters
        if (filters.rating) {
            reviewsList = reviewsList.filter((review) => review.rating === Number(filters.rating));
        }

        if (filters.user) {
            reviewsList = reviewsList.filter((review) =>
                review.user.toLowerCase().includes(filters.user.toLowerCase())
            );
        }

        if (filters.date) {
            reviewsList = reviewsList.filter((review) => review.date === filters.date);
        }

        return reviewsList;
    };

    return (
        <div className="min-h-screen ">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                <FaStar className="text-[#4FD1C5] mr-3 text-3xl"/>
                <span className="flex items-center">
            <span
                className="cursor-pointer hover:underline"
                onClick={() => setSelectedCourse(null)}
            >
                Manage Course Reviews
            </span>
                    {selectedCourseData && (
                        <span className="text-gray-700 ml-2">
                    / {selectedCourseData.title}
                </span>
                    )}
        </span>
            </h1>

            <div className="mt-6 ">
                {!selectedCourse ? (
                    <Table courses={courses} onSelectCourse={setSelectedCourse}/>
                ) : (
                    <>
                        {/* Filter Section */}
                        <div className=" flex justify-end mr-4">
                            <Filter onFilterChange={handleFilterChange}/>
                        </div>

                        {/* Review List */}
                        <ReviewList
                            reviews={filteredReviews(selectedCourse)}
                            onDeleteReview={handleDeleteReview}
                            onAddResponse={handleAddResponse}
                        />
                    </>
                )}
            </div>
        </div>

    );
};

export default ManageReviews;
