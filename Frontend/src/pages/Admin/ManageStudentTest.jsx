import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import Sidebar from "../../layout/AdminLayout/SideBar.jsx";
import Header from "../../layout/AdminLayout/Header.jsx";

const ManageStudentTest = () => {
    const testsData = [
        { idtest: 1, idlesson: 101, content: "Test Content 1", idquestion: 1001, score: 85 },
        { idtest: 2, idlesson: 102, content: "Test Content 2", idquestion: 1002, score: 90 },
        { idtest: 3, idlesson: 103, content: "Test Content 3", idquestion: 1003, score: 78 },
        { idtest: 4, idlesson: 104, content: "Test Content 4", idquestion: 1004, score: 88 },
        { idtest: 5, idlesson: 105, content: "Test Content 5", idquestion: 1005, score: 92 },
        { idtest: 6, idlesson: 106, content: "Test Content 6", idquestion: 1006, score: 75 },
        { idtest: 7, idlesson: 107, content: "Test Content 7", idquestion: 1007, score: 81 },
        { idtest: 8, idlesson: 108, content: "Test Content 8", idquestion: 1008, score: 89 },
        { idtest: 9, idlesson: 109, content: "Test Content 9", idquestion: 1009, score: 84 },
        { idtest: 10, idlesson: 110, content: "Test Content 10", idquestion: 1010, score: 79 },
        { idtest: 11, idlesson: 111, content: "Test Content 11", idquestion: 1011, score: 87 },
        { idtest: 12, idlesson: 112, content: "Test Content 12", idquestion: 1012, score: 91 },
        { idtest: 13, idlesson: 113, content: "Test Content 13", idquestion: 1013, score: 76 },
        { idtest: 14, idlesson: 114, content: "Test Content 14", idquestion: 1014, score: 83 },
        { idtest: 15, idlesson: 115, content: "Test Content 15", idquestion: 1015, score: 88 },
        { idtest: 16, idlesson: 116, content: "Test Content 16", idquestion: 1016, score: 80 },
        { idtest: 17, idlesson: 117, content: "Test Content 17", idquestion: 1017, score: 85 },
        { idtest: 18, idlesson: 118, content: "Test Content 18", idquestion: 1018, score: 90 },
        { idtest: 19, idlesson: 119, content: "Test Content 19", idquestion: 1019, score: 77 },
        { idtest: 20, idlesson: 120, content: "Test Content 20", idquestion: 1020, score: 86 },
        { idtest: 21, idlesson: 121, content: "Test Content 21", idquestion: 1021, score: 82 },
        { idtest: 22, idlesson: 122, content: "Test Content 22", idquestion: 1022, score: 79 }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const testsPerPage = 10;
    const totalPages = Math.ceil(testsData.length / testsPerPage);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = testsData.slice(indexOfFirstTest, indexOfLastTest);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Header />
                <h1 className="text-2xl font-bold text-gray-700 flex items-center mt-4">
                    <FaClipboardList className="text-[#4FD1C5] mr-2" /> Manage Student Tests
                </h1>
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[#4FD1C5] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Test ID</th>
                                <th className="py-3 px-4 text-left">Lesson ID</th>
                                <th className="py-3 px-4 text-left">Content</th>
                                <th className="py-3 px-4 text-left">Question ID</th>
                                <th className="py-3 px-4 text-left">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTests.map((test, index) => (
                                <tr key={test.idtest} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="py-3 px-4">{test.idtest}</td>
                                    <td className="py-3 px-4">{test.idlesson}</td>
                                    <td className="py-3 px-4">{test.content}</td>
                                    <td className="py-3 px-4">{test.idquestion}</td>
                                    <td className="py-3 px-4">{test.score}</td>
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
    );
};

export default ManageStudentTest;
