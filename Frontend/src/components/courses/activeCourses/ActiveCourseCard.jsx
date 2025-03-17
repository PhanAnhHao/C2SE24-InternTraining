import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircle } from "@fortawesome/free-solid-svg-icons";

const ActiveCourseCard = ({ course }) => {
    return (
        <div className="w-105 rounded-xl shadow-lg bg-white hover:scale-105 transition-transform duration-300 cursor-pointer">
            {/* Hình ảnh khóa học */}
            <div className=" p-3">
                <img
                    src="/img/course.png"
                    alt="Course Thumbnail"
                    className="w-full rounded-xl h-50 object-cover"
                />
            </div>

            {/* Nội dung thẻ */}
            <div className="p-4">
                <h3 className=" font-semibold text-gray-900">
                    {course.title}
                </h3>

                {/* Thông tin người dạy */}
                <div className="flex items-center mt-2">
                    <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
                    <span className="ml-2 text-sm font-medium text-gray-800">{course.instructor}</span>
                </div>

                {/* Thanh tiến trình */}
                <div className="relative w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-[#49BBBD] h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>

                {/* Tiến trình */}
                <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faCircle} className="text-[#49BBBD] text-[8px] mr-1 left" />
                    Lesson 5 of 7
                </div>
            </div>
        </div>
    );
};

export default ActiveCourseCard;
