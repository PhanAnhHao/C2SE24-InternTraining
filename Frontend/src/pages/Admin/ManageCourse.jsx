import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Helper function to emit course update event
    const emitCourseUpdate = () => {
        const event = new CustomEvent('coursesUpdated');
        window.dispatchEvent(event);
    };

    // Fetch courses
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

                // Sắp xếp dữ liệu theo thời gian tạo (createdAt) - mới nhất trước
                const sortedData = courseData.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt); // Sắp xếp giảm dần (mới nhất trước)
                });

                setCourses(sortedData);
                // Emit event after successful fetch
                emitCourseUpdate();
            } catch (error) {
                enqueueSnackbar("Failed to fetch courses.", { variant: "error" });
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, [enqueueSnackbar]);

    // Pagination calculations
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Handle delete course
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://localhost:5000/courses/${id}`);
                setCourses((prev) => prev.filter((course) => course._id !== id));
                enqueueSnackbar("Course deleted successfully!", { variant: "success" });
            } catch (error) {
                enqueueSnackbar("Failed to delete course. Please try again.", { variant: "error" });
            }
        }
    };

    // Handle update button click
    const handleUpdateClick = (courseId) => {
        navigate(`/dashboard/courses/${courseId}/edit`);
    };

    return (
        <div className="flex flex-1 p-6">
            <div className="w-full">
                {/* Title and Add Course button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                        <FaClipboardList className="text-[#4FD1C5] mr-2" />
                        Manage Courses
                    </h1>
                    <button
                        onClick={() => navigate("/dashboard/courses/create-course")}
                        className="px-4 py-2 bg-[#4FD1C5] text-white rounded-lg hover:bg-teal-600 transition"
                    >
                        + Add New Course
                    </button>
                </div>

                {/* Courses table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-[#4FD1C5] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">No.</th>
                                <th className="py-3 px-4 text-left font-semibold">Description</th>
                                <th className="py-3 px-4 text-left font-semibold">Language</th>
                                <th className="py-3 px-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCourses.map((course, index) => (
                                <tr
                                    key={course._id}
                                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                                >
                                    <td className="py-3 px-4">{indexOfFirstCourse + index + 1}</td>
                                    <td className="py-3 px-4">{course.infor}</td>
                                    <td className="py-3 px-4">
                                        {typeof course.languageID === "string"
                                            ? course.languageID
                                            : (course.languageID?.name || "N/A")}
                                    </td>
                                    <td className="py-3 px-4 space-x-2">
                                        <button
                                            onClick={() => handleUpdateClick(course._id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                            title="Edit"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            title="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#4FD1C5] text-white hover:bg-teal-600"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded-lg">
                        Page {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#4FD1C5] text-white hover:bg-teal-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;