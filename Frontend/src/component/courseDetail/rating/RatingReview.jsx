import Rank from "../Rank/Rank.jsx";
import RatingSummary from "./RatingSummary.jsx";
import ReviewList from "./ReviewList.jsx";
import { useState } from "react";
const RatingReview = () => {
    const [selected, setSelected] = useState("rating");
    return (
        <div className="w-3/5">
            <div className="flex space-x-4 mb-4">
                {/* Nút Details */}
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selected === "rating"
                        ? "bg-[#49BBBD] text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    onClick={() => setSelected("rating")}
                >
                    Rating
                </button>
                {/* Nút Overview */}
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selected === "rank"
                        ? "bg-[#49BBBD] text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    onClick={() => setSelected("rank")}
                >
                    Rank
                </button>
            </div>
            {
                selected === "rating"
                    ?
                    <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md  h-auto">
                        <RatingSummary />
                        <ReviewList />
                    </div>
                    :
                    <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md  h-auto">
                        <Rank />
                    </div>
            }

        </div>
    );
}
export default RatingReview