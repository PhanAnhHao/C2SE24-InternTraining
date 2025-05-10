import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ lessons }) => {
    const navigate = useNavigate();
    const handleBack = () => {
        // console.log("Navigating back to the previous page");
        // alert("Trở về trang trước");
        navigate(`/course/${lessons[0].idCourse.id}`);
    };

    // Tính toán tiến trình học
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => lesson.status === "active").length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <header className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-sm">
            <div className="flex items-center">
                <button
                    onClick={handleBack}
                    className="mr-4 text-white hover:text-gray-200 transition-colors duration-150"
                >
                    <FaArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <div className="relative w-7 h-7 flex items-center justify-center border-2 border-white rounded transform rotate-45">
                            <span className="text-sm font-bold text-white transform -rotate-45">IT</span>
                        </div>
                    </div>
                    <h1 className="text-lg font-medium tracking-tight ml-2">Kiến Thức Nhập Môn IT</h1>
                </div>
            </div>
            {/* Phần tiến trình học */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full">
                    <span className="text-[12px] font-bold">{progressPercentage}%</span>
                </div>
                <span className="text-sm mr-4">{completedLessons}/{totalLessons} bài học</span>
            </div>
        </header>
    );
};

export default Header;