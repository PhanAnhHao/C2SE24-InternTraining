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

    const isStudentLoggedIn = () => {
        const studentId = localStorage.getItem("studentId");
        const userRole = localStorage.getItem("role");
        return !!studentId && userRole === "Student";
    };

    const handleLearnClick = () => {
        if (isStudentLoggedIn()) {
            navigate(`/online-learning/${courseId}`);
        } else {
            const confirmLogin = window.confirm(
                "Only students can access this course. Please log in as a student to continue."
            );
            if (confirmLogin) {
                navigate("/login");
            }
        }
    };

    const handleTestClick = () => {
        if (isStudentLoggedIn()) {
            if (courseData.test && courseData.test.length > 0) {
                navigate(`/test-page/${courseData.test[0].idTest}`);
            } else {
                alert("There is no test available for this course.");
            }
        } else {
            const confirmLogin = window.confirm(
                "Only students can take the test. Please log in as a student to continue."
            );
            if (confirmLogin) {
                navigate("/login");
            }
        }
    };

    return (
        <div className="w-2/5 mt-[-300px]">
            <div className="w-full p-6 bg-white max-w-sm mx-auto rounded-lg shadow-md">
                {/* Course Image */}
                <img
                    src={courseData.image || "/img/course.png"}
                    alt="Course"
                    className="w-full rounded-md mb-4"
                />

                {/* Learn Button */}
                <button
                    onClick={handleLearnClick}
                    className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-teal-600 transition"
                >
                    Learn
                </button>

                {/* Test Button */}
                <button
                    onClick={handleTestClick}
                    className="w-full bg-gray-300 text-teal-500 font-semibold py-2 rounded-lg mt-4 hover:bg-teal-300 hover:text-white transition"
                >
                    Do Test
                </button>

                <hr className="my-4" />

                {/* Course Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">This Course Includes</h3>
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
                            Certificate of Completion
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faBook} className="text-teal-500 mr-2" />
                            32 Modules
                        </li>
                    </ul>
                </div>

                <hr className="my-4" />

                {/* Group Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-1">Training 5 or more people?</h3>
                    <p className="text-gray-600 text-sm">
                        Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...
                    </p>
                </div>

                <hr className="my-4" />

                {/* Share Options */}
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
