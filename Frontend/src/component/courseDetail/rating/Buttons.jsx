import { useState } from "react";

const Buttons = () => {
    const [selected, setSelected] = useState("rating");

    return (
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
    );
};

export default Buttons;
