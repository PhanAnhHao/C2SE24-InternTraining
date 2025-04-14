// pages/StudentProgress.jsx
import React, { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Hàm chuyển đổi chuỗi ngày (định dạng dd/mm/yyyy) thành đối tượng Date
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
};

const studentsData = [
    { id: 1, name: "Nguyễn Văn A", progress: 75, courseName: "ReactJS", startDate: "01/09/2023" },
    { id: 2, name: "Trần Thị B", progress: 90, courseName: "ReactJS", startDate: "03/09/2023" },
    { id: 3, name: "Lê Văn C", progress: 60, courseName: "ReactJS", startDate: "05/09/2023" },
    { id: 4, name: "Trần Thị B", progress: 90, courseName: "ReactJS", startDate: "03/09/2023" },
    { id: 5, name: "Lê Văn C", progress: 60, courseName: "ReactJS", startDate: "05/09/2023" },
    // Thêm dữ liệu khác nếu cần
];

export default function StudentProgress() {
    // Giả sử tất cả học viên thuộc cùng 1 khóa học
    const courseName = studentsData[0]?.courseName || "Khóa học chưa xác định";

    // sortConfig: key (cột sắp xếp) và direction (asc/desc)
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedStudents = useMemo(() => {
        let sortableStudents = [...studentsData];
        if (sortConfig.key) {
            sortableStudents.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === "startDate") {
                    aValue = parseDate(aValue);
                    bValue = parseDate(bValue);
                } else if (sortConfig.key === "progress") {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
                } else if (sortConfig.key === "name") {
                    // Trích xuất chữ cái đầu của tên cuối để sắp xếp
                    const aFirstLetter = aValue.split(" ").pop()[0].toLowerCase(); // Lấy chữ cái đầu của tên cuối
                    const bFirstLetter = bValue.split(" ").pop()[0].toLowerCase(); // Lấy chữ cái đầu của tên cuối

                    return sortConfig.direction === "asc"
                        ? aFirstLetter.localeCompare(bFirstLetter)
                        : bFirstLetter.localeCompare(aFirstLetter);
                }

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableStudents;
    }, [sortConfig]);

    // Hàm hiển thị biểu tượng mũi tên theo hướng sắp xếp, nếu chưa sort hiển thị icon mặc định
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="inline ml-1 text-gray-300" />;
        }
        return sortConfig.direction === "asc" ? (
            <FaSortUp className="inline ml-1 text-white" />
        ) : (
            <FaSortDown className="inline ml-1 text-white" />
        );
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-6">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-2">
                Student Progress Tracking
            </h2>
            <p className="text-xl text-center text-gray-600 mb-6">
                Course: {courseName}
            </p>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-gray-700">
                    <thead>
                    <tr className="bg-[#4FD1C5] text-white text-left uppercase">
                        <th className="px-6 py-3 font-semibold">No.</th>
                        <th
                            className="px-6 py-3 font-semibold cursor-pointer select-none"
                            onClick={() => handleSort("name")}
                        >
                            Student Name {getSortIndicator("name")}
                        </th>
                        <th
                            className="px-6 py-3 font-semibold cursor-pointer select-none"
                            onClick={() => handleSort("startDate")}
                        >
                            Start Date {getSortIndicator("startDate")}
                        </th>
                        <th
                            className="px-6 py-3 font-semibold cursor-pointer select-none"
                            onClick={() => handleSort("progress")}
                        >
                            Progress {getSortIndicator("progress")}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedStudents.map((student, index) => (
                        <tr
                            key={student.id}
                            className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-2">{index + 1}</td>
                            <td className="px-6 py-2">{student.name}</td>
                            <td className="px-6 py-2">{student.startDate}</td>
                            <td className="px-6 py-2">
                                <div className="relative">
                                    <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-[#4FD1C5]">
                                        {student.progress}%
                                    </span>
                                        <span className="text-sm font-medium text-gray-400">100%</span>
                                    </div>
                                    <div className="w-full bg-gray-300 rounded-full h-4">
                                        <div
                                            className="bg-[#4FD1C5] h-4 rounded-full transition-all duration-500"
                                            style={{ width: `${student.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
