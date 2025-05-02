import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const coursesPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/courses");
                const sortedData = res.data.sort((a, b) => {
                    const numA = parseInt(a.idCourse.replace(/\D/g, ""));
                    const numB = parseInt(b.idCourse.replace(/\D/g, ""));
                    return numA - numB;
                });
                setCourses(sortedData);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCourses();
    }, []);

    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://localhost:5000/courses/${id}`);
                setCourses(prev => prev.filter(course => course._id !== id));
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const handleEditClick = (course) => {
        setEditingId(course._id);
        setEditForm({ ...course });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const validateEditForm = () => {
        const { idCourse, info, languageID, rating } = editForm;
        if (!idCourse || !info || !languageID || !rating) {
            alert("Please fill in all fields.");
            return false;
        }
        return true;
    };

    const handleEditSubmit = async () => {
        if (!validateEditForm()) return;
        try {
            await axios.put(`http://localhost:5000/courses/${editingId}`, editForm);
            setCourses(prev =>
                prev.map(course => (course._id === editingId ? { ...editForm, _id: editingId } : course))
            );
            setEditingId(null);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex justify-between">

                <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                    <FaClipboardList className="text-[#4FD1C5] mr-2" /> Manage Courses
                </h1>
                <button
                    onClick={() => navigate("/dashboard/courses/create-course")}
                    className="px-4 py-2 bg-[#4FD1C5] text-white rounded hover:bg-teal-500 transition"
                >
                    + Add New Course
                </button>
                </div>
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[#4FD1C5] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Course ID</th>
                            <th className="py-3 px-4 text-left">Infor</th>
                            <th className="py-3 px-4 text-left">Language ID</th>
                            <th className="py-3 px-4 text-left">Rating</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentCourses.map((course, index) => (
                            <tr key={course._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="py-3 px-4">
                                    {editingId === course._id ? (
                                        <input
                                            name="idCourse"
                                            value={editForm.idCourse}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.idCourse
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course._id ? (
                                        <input
                                            name="infor"
                                            value={editForm.info}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.info
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course._id ? (
                                        <input
                                            name="languageID"
                                            value={editForm.languageID?.name || ""}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.languageID.name
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course._id ? (
                                        <input
                                            name="rating"
                                            value={editForm.rating}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.rating
                                    )}
                                </td>
                                <td className="py-3 px-4 space-x-2">
                                    {editingId === course._id ? (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                                onClick={handleEditSubmit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleEditClick(course)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDelete(course._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"
                        }`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"
                        }`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;