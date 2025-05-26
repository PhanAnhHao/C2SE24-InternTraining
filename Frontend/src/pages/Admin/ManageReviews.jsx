import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import ReviewList from "../../../src/component/Admin/ManageReviews/ReviewList.jsx";
import Table from "../../../src/component/Admin/ManageReviews/Table.jsx";
import Filter from "../../../src/component/Admin/ManageReviews/Filter";
import axios from "axios";
import { useSnackbar } from "notistack"; // Thêm useSnackbar

const ManageReviews = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [reviewsData, setReviewsData] = useState([]);
    const [filters, setFilters] = useState({
        rating: "",
        user: "",
        date: "",
    });
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState(null);

    const { enqueueSnackbar } = useSnackbar(); // Thêm enqueueSnackbar

    // Gọi API lấy danh sách khóa học
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const role = localStorage.getItem('role');
                let url = "http://localhost:5000/courses";

                // Nếu role là Business, lấy businessId và thêm vào query
                if (role === "Business") {
                    const businessId = localStorage.getItem('businessId');
                    if (!businessId) {
                        enqueueSnackbar("Business ID not found. Please log in again.", { variant: "error" });
                        return;
                    }
                    url = `http://localhost:5000/courses/business/${businessId}`;
                }

                const response = await axios.get(url);
                let courseData = [];

                // Chuẩn hóa dữ liệu: lấy mảng khóa học từ API
                if (role === "Business") {
                    courseData = response.data.courses || [];
                } else {
                    courseData = response.data || [];
                }

                console.log("Courses:", courseData);
                setCourses(courseData);
            } catch (error) {
                console.error("Error fetching courses:", error);
                enqueueSnackbar("Failed to fetch courses.", { variant: "error" }); // Thêm thông báo lỗi
            }
        };
        fetchCourses();
    }, [enqueueSnackbar]);

    // Gọi API để lấy reviews khi người dùng chọn một khóa học
    useEffect(() => {
        const fetchReviews = async () => {
            if (!selectedCourse) {
                console.log("No course selected, clearing reviews data.");
                setReviewsData([]);
                setLoadingReviews(false);
                return;
            }

            try {
                setLoadingReviews(true);
                console.log("Fetching reviews for course ID:", selectedCourse);
                console.log("API URL:", `http://localhost:5000/ratings/course/${selectedCourse}`);
                const response = await axios.get(`http://localhost:5000/ratings/course/${selectedCourse}`);
                const apiReviews = response.data;
                console.log("Reviews data:", apiReviews);

                // Kiểm tra xem apiReviews.ratings có phải là mảng không
                if (!apiReviews || !Array.isArray(apiReviews.ratings)) {
                    console.error("apiReviews.ratings is not an array:", apiReviews);
                    setError("No reviews available for this course.");
                    setReviewsData([]);
                    setLoadingReviews(false);
                    return;
                }

                const mappedReviews = apiReviews.ratings.map((rating) => ({
                    id: rating._id,
                    user: rating.studentId?.userId?.userName || "Anonymous Pill", // Sửa studentID thành studentId
                    nameCourse: courses.find((course) => course.id === selectedCourse)?.title || "Unknown Course",
                    rating: rating.stars || 0,
                    comment: rating.feedback || "",
                    date: rating.createdAt
                        ? new Date(rating.createdAt).toLocaleDateString("en-GB")
                        : "Unknown Date",
                    adminResponse: "",
                }));

                console.log("Mapped reviews:", mappedReviews);
                setReviewsData(mappedReviews);
                setLoadingReviews(false);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                console.log("Error details:", {
                    message: err.message,
                    response: err.response ? err.response.data : null,
                    status: err.response ? err.response.status : null,
                });
                setError("Failed to fetch reviews: " + err.message);
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [selectedCourse]); // Bỏ dependency courses

    const selectedCourseData = courses.find((course) => course.id === selectedCourse) || null;

    const handleDeleteReview = (courseId, reviewId) => {
        console.log("Deleting review:", { courseId, reviewId });
        const updatedReviews = reviewsData.filter((review) => review.id !== reviewId);
        setReviewsData(updatedReviews);
    };

    const handleAddResponse = (courseId, reviewId, response) => {
        console.log("Adding response:", { courseId, reviewId, response });
        const updatedReviews = [...reviewsData];
        const reviewIndex = updatedReviews.findIndex((review) => review.id === reviewId);
        if (reviewIndex !== -1) {
            updatedReviews[reviewIndex].adminResponse = response;
        }
        setReviewsData(updatedReviews);
    };

    const handleFilterChange = (filterKey, value) => {
        console.log("Filter changed:", { filterKey, value });
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: value,
        }));
    };

    const filteredReviews = () => {
        let reviewsList = reviewsData;

        if (filters.rating) {
            reviewsList = reviewsList.filter((review) => review.rating === Number(filters.rating));
        }

        if (filters.user) {
            reviewsList = reviewsList.filter((review) =>
                review.user.toLowerCase().includes(filters.user.toLowerCase())
            );
        }

        if (filters.date) {
            reviewsList = reviewsList.filter((review) => {
                const filterDate = new Date(filters.date).toLocaleDateString("en-GB");
                return review.date === filterDate;
            });
        }

        console.log("Filtered reviews:", reviewsList);
        return reviewsList;
    };



    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                <FaStar className="text-[#4FD1C5] mr-3 text-3xl" />
                <span className="flex items-center">
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                            console.log("Navigating back to course list");
                            setSelectedCourse(null);
                            setError(null);
                        }}
                    >
                        Manage Course Reviews
                    </span>
                    {selectedCourseData && (
                        <span className="text-gray-700 ml-2">/ {selectedCourseData.title}</span>
                    )}
                </span>
            </h1>

            <div className="mt-6">
                {!selectedCourse ? (
                    <Table courses={courses} onSelectCourse={setSelectedCourse} />
                ) : (
                    <>
                    <div className="mb-4 flex justify-between items-center">
                        <button
                            onClick={() => {
                                setSelectedCourse(null);
                                setError(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 ml-6 bg-[#4FD1C5] text-white rounded-md shadow-md hover:bg-teal-500"
                        >
                            Go Back
                        </button>
                        <Filter onFilterChange={handleFilterChange} />
                    </div>

                        {error && (
                            <div className="text-red-500 mb-4">
                                {error}
                                <button
                                    className="ml-4 text-blue-500 underline"
                                    onClick={() => {
                                        console.log("Navigating back to course list due to error");
                                        setSelectedCourse(null);
                                        setError(null);
                                    }}
                                >
                                    Go back
                                </button>
                            </div>
                        )}
                        {loadingReviews ? (
                            <div>Loading reviews...</div>
                        ) : error ? null : (
                            <ReviewList
                                reviews={filteredReviews()}
                                onDeleteReview={handleDeleteReview}
                                onAddResponse={handleAddResponse}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageReviews;