import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import theme_log from "../../../assets/ava_lap.jpg";

const blogItems = [
    { id: 1, title: "UX/UI", image: theme_log },
    { id: 2, title: "React", image: theme_log },
    { id: 3, title: "PHP", image: theme_log },
    { id: 4, title: "JavaScript", image: theme_log },
    { id: 5, title: "Node.js", image: theme_log },
    { id: 6, title: "Python", image: theme_log },
    { id: 7, title: "Django", image: theme_log },
    { id: 8, title: "TypeScript", image: theme_log },
    { id: 9, title: "Vue.js", image: theme_log },
    { id: 10, title: "Angular", image: theme_log },
];

const BlogList = () => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleItems = 4;

    const nextSlide = () => {
        if (startIndex < blogItems.length - visibleItems) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-6">
            <h2 className="text-lg font-semibold mb-4">Reading blog list</h2>
            <div className="relative flex items-center">
                {/* Button Prev */}
                <button
                    onClick={prevSlide}
                    className={`p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition ${startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={startIndex === 0}
                >
                    <FaChevronLeft />
                </button>

                {/* List images*/}
                <div className="overflow-hidden w-[1000px] mx-4">
                    <div
                        className="flex gap-4 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${startIndex * (100 / visibleItems)}%)` }}
                    >
                        {blogItems.map((item) => (
                            <div key={item.id} className="relative w-[240px] h-[240px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow text-sm font-medium">
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button*/}
                <button
                    onClick={nextSlide}
                    className={`p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition ${startIndex >= blogItems.length - visibleItems ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={startIndex >= blogItems.length - visibleItems}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default BlogList;
