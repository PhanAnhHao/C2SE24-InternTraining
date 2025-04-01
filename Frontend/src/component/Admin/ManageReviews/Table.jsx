import React from "react";
import Button from "../../common/Button.jsx";
import { FaStar } from "react-icons/fa";

const Table = ({ courses, onSelectCourse }) => {
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full border-collapse text-gray-700">
                <thead className="bg-[#4FD1C5] text-white text-left uppercase">
                <tr>
                    <th className="p-2">Khóa học</th>
                    <th className="p-2">Danh mục</th>
                    <th className="p-2">Thời lượng</th>
                    <th className="p-2">Giảng viên</th>
                    <th className="p-2">Đánh giá trung bình</th>
                    <th className="p-2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course, index) => (
                    <tr
                        key={course.id}
                        className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                                hover:bg-gray-100 transition-all duration-200`}
                    >
                        <td className="p-2 font-semibold">{course.title}</td>
                        <td className="p-2">{course.category}</td>
                        <td className="p-2">{course.duration}</td>
                        <td className="p-2">{course.instructor}</td>
                        <td className="p-2 flex items-center ">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-1 font-medium">{course.averageRating.toFixed(1)}</span>
                        </td>
                        <td className="p-2">
                            <Button className="mr-2" onClick={() => onSelectCourse(course.id)}>
                                Xem tất cả đánh giá
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
