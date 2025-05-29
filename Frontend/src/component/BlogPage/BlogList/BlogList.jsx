import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import theme_log from "../../../assets/ava_lap.jpg";
import Reactimg from "../../../assets/reactjs.jpg";
import PHP from "../../../assets/php.jpg";
import JavaScript from "../../../assets/javascript.jpg";
import Nodejs from "../../../assets/nodejs.jpg";
import Python from "../../../assets/python.jpg";
import TypeScript from "../../../assets/typescript.jpg";
import Vuejs from "../../../assets/vuejs.jpg";
import Angular from "../../../assets/angular.jpg";

const blogItems = [
    {
        id: 1,
        title: "Reactjs",
        image: Reactimg,
        url: "https://react.dev/learn"
    },
    {
        id: 2,
        title: "PHP",
        image: PHP,
        url: "https://www.php.net/manual/en/getting-started.php"
    },
    {
        id: 3,
        title: "JavaScript",
        image: JavaScript,
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
    },
    {
        id: 4,
        title: "Node.js",
        image: Nodejs,
        url: "https://nodejs.org/en/learn"
    },
    {
        id: 5,
        title: "Python",
        image: Python,
        url: "https://www.python.org/about/gettingstarted/"
    },
    {
        id: 6,
        title: "TypeScript",
        image: TypeScript,
        url: "https://www.typescriptlang.org/docs/"
    },
    {
        id: 7,
        title: "Vuejs",
        image: Vuejs,
        url: "https://vuejs.org/guide/introduction.html"
    },
    {
        id: 8,
        title: "Angular",
        image: Angular,
        url: "https://angular.io/start"
    },
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
            <h2 className="text-lg font-semibold mb-4">Related programming languages</h2>
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
                    >                        {blogItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-[240px] h-[180px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className={`w-full h-full object-contain ${item.id === 3 ? 'scale-[0.85]' : ''
                                    }`}
                            />
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow text-sm font-medium">
                                {item.title}
                            </div>
                        </a>
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
