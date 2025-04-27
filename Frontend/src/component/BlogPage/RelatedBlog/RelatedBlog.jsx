import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // thêm dòng này
import theme_log from "../../../assets/ava_lap.jpg";
import { FaEye } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const RelatedBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(0);
    const step = 3;
    const navigate = useNavigate(); // thêm dòng này

    const getImageUrl = (imagePath) => {
        if (!imagePath) return theme_log;
        if (imagePath.startsWith('http')) return imagePath;
        return imagePath.startsWith('/uploads')
            ? `http://localhost:5000${imagePath}`
            : `http://localhost:5000/uploads/${imagePath}`;
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/blogs?page=1&limit=10');
                const blogsWithFullImageUrls = response.data.blogs.map(blog => ({
                    ...blog,
                    image: getImageUrl(blog.image),
                    author: blog.userId?.userName || 'Anonymous',
                    authorAvatar: blog.userId?.avatar
                        ? getImageUrl(blog.userId.avatar)
                        : theme_log
                }));
                setBlogs(blogsWithFullImageUrls);
                setError(null);
            } catch (err) {
                setError('Error fetching blogs');
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

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

    const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    if (loading) return <div className="bg-blue-100 p-6 rounded-lg">Loading...</div>;
    if (error) return <div className="bg-blue-100 p-6 rounded-lg text-red-500">{error}</div>;

    return (
        <div className="bg-blue-100 p-6 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Related Blog</h2>
                <button
                    onClick={() => navigate('/create-blog')}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                    Create Blog
                </button>
            </div>
            <div className="flex space-x-6 overflow-hidden">
                {blogs.slice(index, index + step).map((blog) => (
                    <div key={blog._id} className="bg-white p-4 rounded-lg shadow-lg w-1/3 h-auto">
                        <div className="relative h-48 overflow-hidden rounded-lg">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = theme_log;
                                }}
                            />
                        </div>
                        <h3 className="font-bold mt-4 line-clamp-2 h-14">{blog.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <img
                                    src={blog.authorAvatar}
                                    alt={`${blog.author}'s avatar`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = theme_log;
                                    }}
                                />
                            </div>
                            <span className="text-sm text-gray-600">{blog.author}</span>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                            {stripHtml(blog.content)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {blog.tags && blog.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                            <div className="flex items-center space-x-1">
                                <FaEye />
                                <span>{blog.views?.toLocaleString() || '0'}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mt-3">
                            <a href="#" className="text-teal-600 hover:text-teal-700 text-sm">Read more</a>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={prevSlide}
                    disabled={index === 0}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
                >
                    <FiChevronLeft />
                </button>
                <button
                    onClick={nextSlide}
                    disabled={index + step >= blogs.length}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default RelatedBlog;
