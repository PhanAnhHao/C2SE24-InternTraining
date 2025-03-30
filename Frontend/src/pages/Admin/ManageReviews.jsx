import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import ReviewList from "../../../src/component/Admin/ManageReviews/ReviewList.jsx";
import Table from "../../../src/component/Admin/ManageReviews/Table.jsx";

const courses = [
    { id: 1, title: "React Basics", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 4.5, totalReviews: 120 },
    { id: 2, title: "Advanced JavaScript", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 3.8, totalReviews: 85 },
    { id: 3, title: "CSS Mastery", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 5.0, totalReviews: 50 },
    { id: 4, title: "Node.js Fundamentals", category: "Frontend", duration: "4h", instructor: "John Doe", averageRating: 4.2, totalReviews: 95 },
];

const reviews = {
    1: [
        { id: 101, user: "Alice", rating: 4, comment: "Khóa học tốt nhưng cần thêm bài tập thực hành.", date: "28/03/2025" },
        { id: 102, user: "Bob", rating: 5, comment: "Cực kỳ hữu ích, giảng viên dạy dễ hiểu!", date: "25/03/2025" },
        { id: 103, user: "Alice", rating: 4, comment: "Khóa học tốt nhưng cần thêm bài tập thực hành.", date: "28/03/2025" },
        { id: 104, user: "Bob", rating: 5, comment: "Cực kỳ hữu ích, giảng viên dạy dễ hiểu!", date: "25/03/2025" },

    ],
    2: [
        { id: 201, user: "Charlie", rating: 2, comment: "Nội dung còn sơ sài, nên bổ sung thêm.", date: "22/03/2025" },
    ],
    3: [
        { id: 301, user: "David", rating: 5, comment: "Rất hay và dễ hiểu!", date: "20/03/2025" },
    ],
    4: [
        { id: 401, user: "Eva", rating: 4, comment: "Học xong có thể áp dụng thực tế ngay!", date: "18/03/2025" },
    ],
};

const ManageReviews = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const selectedCourseData = courses.find(course => course.id === selectedCourse) || null;

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaStar className="text-[#4FD1C5] mr-3 text-3xl" />
                <span>
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => setSelectedCourse(null)}
                    >
                        Manage Course Reviews
                    </span>
                    {selectedCourseData && <span className="text-gray-700"> / {selectedCourseData.title}</span>}
                </span>
            </h1>

            {!selectedCourse ? (
                <Table courses={courses} onSelectCourse={setSelectedCourse} />
            ) : (
                <ReviewList reviews={reviews[selectedCourse] || []} />
            )}
        </div>
    );
};

export default ManageReviews;
