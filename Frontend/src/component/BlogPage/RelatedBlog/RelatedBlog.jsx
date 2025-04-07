import React, { useState } from "react";
import theme_log from "../../../assets/ava_lap.jpg";
import { FaEye } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const RelatedBlog = () => {
    const blogs = [
        {
            id: 1,
            image: theme_log,
            title: "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution",
            author: "Lina",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 251232,
        },
        {
            id: 2,
            image: theme_log,
            title: "Class secures $50 million funding for innovative learning platform",
            author: "Mark",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 189432,
        },
        {
            id: 3,
            image: theme_log,
            title: "Education technology trends in 2024",
            author: "Sophia",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 298754,
        },
        {
            id: 4,
            image: theme_log,
            title: "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution",
            author: "Sophia",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 298754,
        },
        {
            id: 5,
            image: theme_log,
            title: "Education technology trends in 2024",
            author: "Sophia",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 298754,
        },
        {
            id: 6,
            image: theme_log,
            title: "Education technology trends in 2024",
            author: "Sophia",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
            views: 298754,
        },
        {
            id: 7,
            image: theme_log,
            title: "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution",
            author: "Sophia",
            description: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen...",
            views: 298754,
        },
    ];

    const [index, setIndex] = useState(0);
    const step = 3;

    const nextSlide = () => {
        if (index + step < blogs.length) {
            setIndex(index + step);
        }
    };

    const prevSlide = () => {
        if (index - step >= 0) {
            setIndex(index - step);
        }
    };

    return (
        <div className="bg-blue-100 p-6 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Related Blog</h2>
                <a href="#" className="text-teal-600">See all</a>
            </div>
            <div className="flex space-x-6 overflow-hidden">
                {blogs.slice(index, index + step).map((blog) => (
                    <div key={blog.id} className="bg-white p-4 rounded-lg shadow-lg w-1/3 h-auto">
                        <img src={blog.image} alt="Blog" className="rounded-lg w-full object-cover" />
                        <h3 className="font-bold mt-4">{blog.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <img src={theme_log} alt="Avatar" className="w-6 h-6 rounded-full" />
                            <span>{blog.author}</span>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm">{blog.description}</p>
                        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                            <a href="#" className="text-teal-600">Read more</a>
                            <div className="flex items-center space-x-1">
                                <FaEye />
                                <span>{blog.views.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={prevSlide} disabled={index === 0} className="p-2 bg-gray-200 rounded-full disabled:opacity-50">
                    <FiChevronLeft />
                </button>
                <button onClick={nextSlide} disabled={index + step >= blogs.length} className="p-2 bg-gray-200 rounded-full disabled:opacity-50">
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default RelatedBlog;