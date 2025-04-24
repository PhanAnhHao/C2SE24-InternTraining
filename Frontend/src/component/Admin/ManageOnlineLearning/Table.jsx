import React from "react";
import Button from "../../common/Button.jsx";
import {FaStar} from "react-icons/fa";

const Table = ({ courses, onSelectCourse, onSelectStudentList }) => {
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full border-collapse text-gray-700">
                <thead className="bg-[#4FD1C5] text-white text-left uppercase">
                <tr>
                    <th className="p-2">No.</th>
                    <th className="p-2">Course Name</th>
                    <th className="p-2">Language</th>
                    <th className="p-2">Rating</th>
                    <th className="p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course, index) => (
                    <tr
                        key={course._id}
                        className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200`}
                    >
                        <td className="p-2 font-semibold">{index + 1}</td>
                        <td className="p-2">{course.infor}</td>
                        <td className="p-2">{course.languageID?.name || "N/A"}</td>
                        <td className="p-2  font-medium">{course.avgRating}</td>
                        <td className="p-2 flex gap-2">
                            <Button onClick={() => onSelectCourse(course._id)}>
                                View Lessons
                            </Button>
                            <Button onClick={() => onSelectStudentList(course._id)}>
                                Learning Progress
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
