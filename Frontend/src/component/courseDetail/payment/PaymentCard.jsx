import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faMobileAlt, faCertificate, faBook,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faYoutube, faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentCard = (props) => {
    const { courseData } = props;
    console.log("courseData: ", courseData);
    const courseId = courseData.courseId;
    useEffect(() => {
        localStorage.setItem("courseId", courseId);
    }, [courseId])
    const navigate = useNavigate();
    return (
        <div className="  w-2/5 mt-[-300px]">
            <div className="w-full p-6 bg-white max-w-sm mx-auto rounded-lg shadow-md">

                {/* Hình ảnh khóa học */}
                <img
                    src={"/img/course.png"}
                    alt="Course"
                    className="w-full rounded-md mb-4"
                />

                {/* Giá và khuyến mãi */}
                {/* <div className="text-center">
                <p className="text-2xl font-bold">
                    $49.65 <span className="text-gray-400 line-through">$99.99</span>
                    <span className="text-green-500 text-sm font-semibold"> 50% Off</span>
                </p>
                <p className="text-blue-500 text-sm font-semibold mt-1">11 hours left at this price</p>
            </div> */}

                {/* Nút mua */}
                <button className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-teal-600 transition">
                    Study
                </button>
                <button
                    onClick={() => navigate(`/test-page/${courseData.test[0].idTest}`)}
                    className="w-full bg-gray-300 text-teal-500 font-semibold py-2 rounded-lg mt-4 hover:bg-teal-300 hover:text-white transition">
                    Do Test
                </button>

                <hr className="my-4" />

                {/* Thông tin khóa học */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">This Course Included</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-teal-500 mr-2" /> Money Back Guarantee</li>
                        <li className="flex items-center"><FontAwesomeIcon icon={faMobileAlt} className="text-teal-500 mr-2" /> Access on all devices</li>
                        <li className="flex items-center"><FontAwesomeIcon icon={faCertificate} className="text-teal-500 mr-2" /> Certification of completion</li>
                        <li className="flex items-center"><FontAwesomeIcon icon={faBook} className="text-teal-500 mr-2" /> 32 Modules</li>
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
