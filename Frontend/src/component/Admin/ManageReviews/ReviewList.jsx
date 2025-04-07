import { FaStar } from "react-icons/fa";
import { useState } from "react";


const ReviewList = ({ reviews = [], onDeleteReview, onAddResponse }) => {

    const [responseText, setResponseText] = useState("");

    const handleResponseChange = (e) => {
        setResponseText(e.target.value);
    };

    const handleAddResponse = (reviewId) => {
        onAddResponse(reviewId, responseText);
        setResponseText("");  // Clear the input after adding response
    };

    return (
        <div className="relative p-4">
            {/* Danh sách đánh giá */}
            {reviews.length === 0 ? (
                <p className="text-gray-500 italic text-center">Chưa có đánh giá nào.</p>
            ) : (
                reviews.map((review) => (
                    <div
                        key={review.id}
                        className={`flex flex-col p-4 rounded-xl shadow-sm mb-4 transition-all duration-300
                            bg-[#E0F7FA] bg-opacity-70`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaStar className="text-yellow-500"/>
                                <span className="font-semibold text-lg">{review.user}</span>
                            </div>
                            <span className="text-gray-600 font-bold text-lg">{review.rating} ★</span>
                        </div>
                        <p className="text-gray-700 mt-2 text-base">Tên khóa học: {review.nameCourse}</p>
                        <p className="text-gray-700 mt-2 text-base">{review.comment}</p>

                        {/* Admin response */}
                        {review.adminResponse && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
                                <strong className="text-gray-800">Admin Response:</strong>
                                <p className="text-gray-600">{review.adminResponse}</p>
                            </div>
                        )}

                        {/* Nút Xóa */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => onDeleteReview(review.id)}
                                className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 hover:shadow-xl font-semibold text-sm py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                Xóa đánh giá
                            </button>


                            {/* Phản hồi từ Admin */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={responseText}
                                    onChange={handleResponseChange}
                                    className=" w-72 border border-gray-300 p-3 rounded-lg   bg-white focus:ring-2 focus:ring-blue-500 text-sm w-2/3"
                                    placeholder="Phản hồi..."
                                />
                                <button
                                    onClick={() => handleAddResponse(review.id)}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:scale-105  hover:shadow-xl font-semibold text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm whitespace-nowrap"
                                >
                                    Phản hồi
                                </button>


                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;
