import React from "react";
import Button from "../../common/Button.jsx";

const Table = ({ courses, onSelectCourse, onSelectStudentList }) => {
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full border-collapse text-gray-700">
                <thead className="bg-[#4FD1C5] text-white text-left uppercase">
                <tr>
                    <th className="p-2">Course</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Instructor</th>
                    <th className="p-2">Actions</th>

                </tr>
                </thead>
                <tbody>
                {courses.map((course, index) => (
                    <tr
                        key={course.id}
                        className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200`}
                    >
                        <td className="p-2 font-semibold">{course.title}</td>
                        <td className="p-2">{course.category}</td>
                        <td className="p-2">{course.duration}</td>
                        <td className="p-2">{course.instructor}</td>
                        <td className="p-2 flex gap-2">
                            <Button onClick={() => onSelectCourse(course.id)}>
                                View Lessons
                            </Button>
                            <Button onClick={() => onSelectStudentList(course.id)}>
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
