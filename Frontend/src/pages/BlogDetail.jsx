import React from "react";
import theme_log from "../assets/ava_lap.jpg";
import RelatedBlog from "../component/BlogPage/RelatedBlog/RelatedBlog";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const getBlogImageUrl = (image) => {
    if (!image) return theme_log;
    if (image.startsWith('http')) return image;
    return `https://storage.googleapis.com/intern-training-ed6ba.appspot.com/blogs/${image}`;
};

const getAvatarUrl = (avatar) => {
    if (!avatar) return theme_log;
    if (avatar.startsWith('http')) return avatar;
    return `https://storage.googleapis.com/intern-training-ed6ba.appspot.com/avatars/${avatar}`;
};

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/blogs/${blogId}`);
                setBlog(response.data.blog);
            } catch (err) {
                console.error(err);
                setError('Error fetching blog detail');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogDetail();
    }, [blogId]);

    if (loading) return <div className="bg-blue-100 p-6 rounded-lg">Loading...</div>;
    if (error) return <div className="bg-blue-100 p-6 rounded-lg text-red-500">{error}</div>;
    if (!blog) return null;

    const tags = blog.tags || [];

    return (
        <div className="p-6">
            {/* Blog Image */}
            <div className="mb-6 flex justify-center">
                <img
                    src={getBlogImageUrl(blog.image)}
                    alt={blog.title}
                    className="max-w-2xl w-full h-auto rounded-lg object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = theme_log;
                    }}
                />
            </div>

            {/* Nội dung bài blog */}
            <h1 className="text-2xl font-bold text-gray-800">{blog.title}</h1>
            <div className="text-gray-600 mt-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Thông tin tác giả */}
            <div className="flex items-center space-x-4 border-t border-gray-300 mt-6 pt-6">
                <img
                    src={getAvatarUrl(blog.userId?.avatar)}
                    alt="Author"
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = theme_log;
                    }}
                />
                <div>
                    <h3 className="text-lg font-semibold">{blog.userId?.userName || 'Anonymous'}</h3>
                    <p className="text-gray-500 text-sm">Tech Writer</p>
                </div>
            </div>

            {/* Danh sách tag */}
            <div className="border-t border-gray-300 mt-6 pt-6">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex space-x-2 mt-2 flex-wrap">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Related Blog */}
            <div className="mt-10 pt-6">
                <h3 className="text-lg font-semibold">Related Blogs</h3>
                <RelatedBlog />
            </div>
        </div>
    );
};

export default BlogDetail;

