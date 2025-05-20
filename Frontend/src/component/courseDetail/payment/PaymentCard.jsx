import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faMobileAlt, faCertificate, faBook,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faYoutube, faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentCard = (props) => {
    const { courseData } = props;
    console.log("courseData: ", courseData);
    const courseId = courseData.courseId;
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("courseId", courseId);
    }, [courseId]);

    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = () => {
        const studentId = localStorage.getItem("studentId");
        return !!studentId; // Trả về true nếu studentId tồn tại
    };

    // Xử lý khi nhấn nút "Learn"
    const handleLearnClick = () => {
        if (isLoggedIn()) {
            navigate(`/online-learning/${courseId}`);
        } else {
            const confirmLogin = window.confirm(
                "Bạn cần đăng nhập để tham gia khóa học. Vui lòng đăng nhập để tiếp tục."
            );
            if (confirmLogin) {
                navigate("/login"); // Điều hướng đến trang đăng nhập nếu nhấn OK
            }
        }
    };

    // Xử lý khi nhấn nút "Do Test"
    const handleTestClick = () => {
        if (isLoggedIn()) {
            if (courseData.test && courseData.test.length > 0) {
                navigate(`/test-page/${courseData.test[0].idTest}`);
            } else {
                alert("Không có bài kiểm tra nào cho khóa học này");
            }
        } else {
            const confirmLogin = window.confirm(
                "Bạn cần đăng nhập để làm bài kiểm tra. Vui lòng đăng nhập để tiếp tục."
            );
            if (confirmLogin) {
                navigate("/login"); // Điều hướng đến trang đăng nhập nếu nhấn OK
            }
        }
    };

    return (
        <div className="w-2/5 mt-[-300px]">
            <div className="w-full p-6 bg-white max-w-sm mx-auto rounded-lg shadow-md">
                {/* Hình ảnh khóa học */}
                <img
                    src={courseData.image || "/img/course.png"}
                    alt="Course"
                    className="w-full rounded-md mb-4"
                />

                {/* Nút mua */}
                <button
                    onClick={handleLearnClick}
                    className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-teal-600 transition"
                >
                    Learn
                </button>
                <button
                    onClick={handleTestClick}
                    className="w-full bg-gray-300 text-teal-500 font-semibold py-2 rounded-lg mt-4 hover:bg-teal-300 hover:text-white transition"
                >
                    Do Test
                </button>

                <hr className="my-4" />

                {/* Thông tin khóa học */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">This Course Included</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-teal-500 mr-2" />
                            Money Back Guarantee
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faMobileAlt} className="text-teal-500 mr-2" />
                            Access on all devices
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faCertificate} className="text-teal-500 mr-2" />
                            Certification of completion
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faBook} className="text-teal-500 mr-2" />
                            32 Modules
                        </li>
                    </ul>
                </div>

                <hr className="my-4" />

                {/* Thông tin nhóm */}
                <div>
                    <h3 className="text-lg font-semibold mb-1">Training 5 or more people</h3>
                    <p className="text-gray-600 text-sm">
                        Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...
                    </p>
                </div>

                <hr className="my-4" />

                {/* Chia sẻ khóa học */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Share this course</h3>
                    <div className="flex space-x-4 text-gray-500 text-xl">
                        <FontAwesomeIcon icon={faFacebook} className="hover:text-blue-500 cursor-pointer" />
                        <FontAwesomeIcon icon={faYoutube} className="hover:text-red-500 cursor-pointer" />
                        <FontAwesomeIcon icon={faTwitter} className="hover:text-blue-400 cursor-pointer" />
                        <FontAwesomeIcon icon={faTelegram} className="hover:text-blue-600 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCard;