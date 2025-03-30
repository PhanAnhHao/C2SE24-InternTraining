import { useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import Sidebar from "../../layout/AdminLayout/SideBar.jsx";
import Header from "../../layout/AdminLayout/Header.jsx";

const ManageStudent = () => {
    const studentsData = Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        age: 18 + (i % 5),
        school: `School ${i % 3 + 1}`,
        mail: `student${i + 1}@example.com`,
        course: `Course ${i % 4 + 1}`
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const totalPages = Math.ceil(studentsData.length / studentsPerPage);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = studentsData.slice(indexOfFirstStudent, indexOfLastStudent);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                        <FaUserGraduate className="text-[#4FD1C5] mr-2" /> Manage Students
                    </h1>
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-[#4FD1C5] text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Age</th>
                                    <th className="py-3 px-4 text-left">School</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.map((student, index) => (
                                    <tr key={student.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                        <td className="py-3 px-4">{student.id}</td>
                                        <td className="py-3 px-4">{student.name}</td>
                                        <td className="py-3 px-4">{student.age}</td>
                                        <td className="py-3 px-4">{student.school}</td>
                                        <td className="py-3 px-4">{student.mail}</td>
                                        <td className="py-3 px-4">{student.course}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="px-4 py-2 bg-gray-200 rounded">Page {currentPage} of {totalPages}</span>
                        <button
                            className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStudent;
