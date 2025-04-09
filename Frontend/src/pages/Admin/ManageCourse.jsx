import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";

const ManageCourse = () => {
    const coursesData = [
        { idCourse: 1, name: "React for Beginners", language: "React", instructor: "John Doe", duration: "6 weeks" },
        { idCourse: 2, name: "Mastering Python", language: "Python", instructor: "Alice Smith", duration: "8 weeks" },
        { idCourse: 3, name: "Vue.js Advanced", language: "Vue", instructor: "Robert Brown", duration: "5 weeks" },
        { idCourse: 4, name: "Java Essentials", language: "Java", instructor: "Emily Davis", duration: "7 weeks" },
        { idCourse: 5, name: "Fullstack with Node.js", language: "JavaScript", instructor: "Michael Johnson", duration: "10 weeks" },
        { idCourse: 6, name: "C++ Fundamentals", language: "C++", instructor: "Sarah White", duration: "6 weeks" },
        { idCourse: 7, name: "Django Web Development", language: "Python", instructor: "William Lee", duration: "9 weeks" },
        { idCourse: 8, name: "Spring Boot & Microservices", language: "Java", instructor: "Sophia Martinez", duration: "12 weeks" },
        { idCourse: 9, name: "Angular for Professionals", language: "Angular", instructor: "Daniel Wilson", duration: "8 weeks" },
        { idCourse: 10, name: "Flutter Mobile Development", language: "Dart", instructor: "Emma Thomas", duration: "7 weeks" },
        { idCourse: 11, name: "Rust Systems Programming", language: "Rust", instructor: "James Anderson", duration: "6 weeks" },
        { idCourse: 12, name: "Swift iOS Development", language: "Swift", instructor: "Olivia Scott", duration: "8 weeks" },
        { idCourse: 13, name: "Intro to Kubernetes", language: "Kubernetes", instructor: "Chris Evans", duration: "4 weeks" },
        { idCourse: 14, name: "Data Science with R", language: "R", instructor: "Jessica Taylor", duration: "9 weeks" },
        { idCourse: 15, name: "Machine Learning Basics", language: "Python", instructor: "Paul Walker", duration: "7 weeks" },
        { idCourse: 16, name: "ASP.NET Core Development", language: "C#", instructor: "Anna Brown", duration: "10 weeks" },
        { idCourse: 17, name: "Blockchain Development", language: "Solidity", instructor: "David Miller", duration: "8 weeks" },
        { idCourse: 18, name: "Game Development with Unity", language: "C#", instructor: "Julia Roberts", duration: "9 weeks" },
        { idCourse: 19, name: "Ethical Hacking & Cybersecurity", language: "Various", instructor: "Steven Lee", duration: "6 weeks" },
        { idCourse: 20, name: "Ruby on Rails Bootcamp", language: "Ruby", instructor: "Rachel Green", duration: "8 weeks" },
        { idCourse: 21, name: "Advanced React Patterns", language: "React", instructor: "Peter Parker", duration: "5 weeks" },
        { idCourse: 22, name: "DevOps Essentials", language: "Various", instructor: "Tony Stark", duration: "6 weeks" },
        { idCourse: 23, name: "iOS App Security", language: "Swift", instructor: "Natasha Romanoff", duration: "5 weeks" },
        { idCourse: 24, name: "PostgreSQL Mastery", language: "SQL", instructor: "Hulk Banner", duration: "4 weeks" },
        { idCourse: 25, name: "Cloud Computing with AWS", language: "Various", instructor: "Thor Odinson", duration: "8 weeks" }
    ];

    const [courses, setCourses] = useState(coursesData);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const coursesPerPage = 10;
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            setCourses(courses.filter(course => course.idCourse !== id));
        }
    };

    const handleEditClick = (course) => {
        setEditingId(course.idCourse);
        setEditForm({ ...course });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const validateEditForm = () => {
        const { name, language, instructor, duration } = editForm;
        if (!name || !language || !instructor || !duration) {
            alert("Please fill in all fields.");
            return false;
        }
        return true;
    };

    const handleEditSubmit = () => {
        if (!validateEditForm()) return;
        setCourses(prev =>
            prev.map(course => (course.idCourse === editingId ? { ...editForm } : course))
        );
        setEditingId(null);
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                    <FaClipboardList className="text-[#4FD1C5] mr-2" /> Manage Courses
                </h1>
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[#4FD1C5] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Course ID</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Language</th>
                            <th className="py-3 px-4 text-left">Instructor</th>
                            <th className="py-3 px-4 text-left">Duration</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentCourses.map((course, index) => (
                            <tr key={course.idCourse} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="py-3 px-4">{course.idCourse}</td>
                                <td className="py-3 px-4">
                                    {editingId === course.idCourse ? (
                                        <input
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.name
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course.idCourse ? (
                                        <input
                                            name="language"
                                            value={editForm.language}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.language
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course.idCourse ? (
                                        <input
                                            name="instructor"
                                            value={editForm.instructor}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.instructor
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === course.idCourse ? (
                                        <input
                                            name="duration"
                                            value={editForm.duration}
                                            onChange={handleEditChange}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        course.duration
                                    )}
                                </td>
                                <td className="py-3 px-4 space-x-2">
                                    {editingId === course.idCourse ? (
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
                                                onClick={() => handleDelete(course.idCourse)}
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
                        className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
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
