
import { FaStar } from "react-icons/fa";


const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-red-100"];

const ReviewList = ({ reviews = [] }) => {

    return (
        <div className="relative p-4">
            {/* Danh sách đánh giá */}
            {reviews.length === 0 ? (
                <p className="text-gray-500 italic text-center">Chưa có đánh giá nào.</p>
            ) : (
                reviews.map((review, index) => (
                    <div
                        key={review.id}
                        className={`flex flex-col p-4 rounded-lg shadow-md mb-3 transition-all duration-200
                            hover:shadow-lg hover:scale-[1.02] ${colors[index % colors.length]}`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaStar className="text-yellow-500" />
                                <span className="font-medium">{review.user}</span>
                            </div>
                            <span className="text-gray-600 font-bold">{review.rating} ★</span>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>

                    </div>
                ))
            )}


        </div>
    );
};

export default ReviewList;