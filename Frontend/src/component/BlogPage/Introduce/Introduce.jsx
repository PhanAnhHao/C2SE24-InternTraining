import React from "react";
import theme_log from "../../../assets/ava_lap.jpg";

const Introduce = () => {
    return (
        <>
            <div className="bg-blue-50 p-10 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-6 max-w-6xl mx-auto shadow-md">
                {/* Left Side Content */}
                <div className="flex-1 text-left">
                    <p className="text-gray-600 text-sm">
                        By <span className="font-semibold">Themadbrains</span> in <span className="text-teal-500 font-semibold">inspiration</span>
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                        Why Swift UI Should Be on the Radar of Every Mobile Developer
                    </h2>
                    <p className="text-gray-600 mt-3 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempos Lorem ipsum dolor sitamet, consectetur adipiscing elit, sed do
                        eiusmod tempor
                    </p>
                    <button className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:bg-teal-600">
                        Start learning now
                    </button>
                </div>

                {/* Right Side Image */}
                <div className="flex-1">
                    <img src={theme_log} alt="Laptop" className="rounded-lg shadow-md w-full object-cover" />
                </div>
            </div>
        </>
    );
};

export default Introduce;
