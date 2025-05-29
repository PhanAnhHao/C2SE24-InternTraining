import React from "react";
import { useNavigate } from "react-router-dom";
import theme_log from "../../../assets/ava_lap.jpg";
import { useBlog } from "../../../context/BlogContext";

const Introduce = () => {
    const navigate = useNavigate();
    const { featuredArticle } = useBlog();
    return (
        <>
            <div className="bg-blue-50 p-10 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-6 max-w-6xl mx-auto shadow-md">
                {/* Left Side Content */}                <div className="flex-1 text-left">
                    <p className="text-gray-600 text-sm">
                        By <span className="font-semibold">{featuredArticle?.author}</span> in <span className="text-teal-500 font-semibold">{featuredArticle?.category}</span>
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                        {featuredArticle?.title}
                    </h2>
                    <p className="text-gray-600 mt-3 text-sm">
                        {featuredArticle?.description}
                    </p>                    <a
                        onClick={() => navigate('/article-detail', { state: { article: featuredArticle } })}
                        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:bg-teal-600 inline-block cursor-pointer"
                    >
                        See now
                    </a>
                </div>

                {/* Right Side Image */}                <div className="flex-1">
                    <img
                        src={featuredArticle?.image || theme_log}
                        alt={featuredArticle?.title || "Featured Article"}
                        className="rounded-lg shadow-md w-full h-[300px] object-cover"
                    />
                </div>
            </div>
        </>
    );
};

export default Introduce;
