import { useState } from "react";

const Buttons = () => {
    const [selected, setSelected] = useState("overview");

    return (
        <div className="flex space-x-4 mb-4">
            {/* Nút Overview */}
            <button
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    selected === "overview"
                        ? "bg-[#49BBBD] text-white"
                        : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setSelected("overview")}
            >
                Overview
            </button>

            {/* Nút Details */}
            <button
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    selected === "details"
                        ? "bg-[#49BBBD] text-white"
                        : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setSelected("details")}
            >
                Rating
            </button>
        </div>
    );
};

export default Buttons;
