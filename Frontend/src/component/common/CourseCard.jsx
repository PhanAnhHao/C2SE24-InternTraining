import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faClock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/course/1`);
        window.scrollTo(0, 0);
    };
    return (
        <div className="w-72 rounded-xl shadow-lg bg-white border border-gray-200 p-3 hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={handleClick}>
            {/* Hình ảnh khóa học */}
            <div className="relative w-full h-44">
                <img
                    src={"/img/course.png"}
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Nội dung thẻ */}
            <div className="p-4 ">
                {/* Danh mục và thời gian */}
                <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faTh} />
                        <span>{course.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{course.duration}</span>
                    </div>
                </div>

                {/* Tiêu đề khóa học */}
                <h3 className="text-lg font-semibold text-gray-900">
                    {course.title}
                </h3>

                {/* Mô tả */}
                <p className="text-gray-500 text-sm mt-2">
                    {course.description}
                </p>

                {/* Giáo viên và giá */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                        <img
                            src={course.instructorImage || "https://randomuser.me/api/portraits/women/44.jpg"}
                            alt="Instructor"
                            className="w-8 h-8 rounded-full border"
                        />
                        <span className="ml-2 font-medium text-gray-900 text-sm">{course.instructor}</span>
                    </div>

                    <div className="text-right">
                        <span className="text-gray-400 text-sm line-through">${course.oldPrice}</span>
                        <span className="text-[#49BBBD] font-bold text-lg ml-2">${course.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
