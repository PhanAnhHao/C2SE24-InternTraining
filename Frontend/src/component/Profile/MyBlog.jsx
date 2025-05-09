import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import theme_log from '../../assets/ava_lap.jpg';
import ProfileSideBar from '../../layout/ProfileSideBar';
import { MoreVertical } from 'lucide-react';

const getBlogImageUrl = (image) => {
    if (!image) return theme_log;
    if (image.startsWith('http')) return image;
    // Nếu là tên file, prepend domain Firebase
    return `https://storage.googleapis.com/intern-training-ed6ba.appspot.com/blogs/${image}`;
};

const MyBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1
    });
    const [menuOpen, setMenuOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserBlogs();
    }, []);

    const fetchUserBlogs = async () => {
        try {
            setLoading(true);
            // Get token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login to view your blogs');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/blogs/user/blogs', {
                params: {
                    page: pagination.page,
                    limit: 10,
                    status: 'published'
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Fetched blogs:', response.data);
            setBlogs(response.data.blogs);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please login again.');
            } else {
                setError('Failed to load blogs');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/blogs/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs(blogs.filter(blog => blog._id !== blogId));
        } catch (err) {
            alert('Failed to delete blog!');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-4">
            {error}
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex  mx-auto">
                {/* Sidebar */}
                <ProfileSideBar />
                {/* Main content */}
                <div className="flex-1 px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-center flex-1">My Blogs</h1>
                            <button
                                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                                onClick={() => navigate('/create-blog')}
                            >
                                Create Blog
                            </button>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                You haven't created any blogs yet.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
                                        {/* 3 chấm menu */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-100"
                                                onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === blog._id ? null : blog._id); }}
                                            >
                                                <MoreVertical size={22} />
                                            </button>
                                            {menuOpen === blog._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => { setMenuOpen(null); navigate(`/update-blog/${blog._id}`); }}
                                                    >
                                                        Update Blog
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                                        onClick={() => { setMenuOpen(null); handleDelete(blog._id); }}
                                                    >
                                                        Delete Blog
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <Link to={`/blogs/${blog._id}`} className="block hover:bg-gray-50 transition">
                                            {/* Ảnh blog */}
                                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={getBlogImageUrl(blog.image)}
                                                    alt={blog.title}
                                                    className="object-cover w-full h-full"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = theme_log;
                                                    }}
                                                />
                                            </div>
                                            <div className="p-6">
                                                {/* Tiêu đề */}
                                                <h3 className="text-2xl font-bold text-gray-800 mb-2 hover:underline">
                                                    {blog.title}
                                                </h3>
                                                {/* Nội dung tóm tắt */}
                                                <p className="text-gray-700 mb-4 whitespace-pre-line line-clamp-4">{blog.content}</p>
                                                {/* Tag */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {blog.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                {/* Ngày tạo và views */}
                                                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                                    <span>{blog.views} views</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center mt-8 gap-2">
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => {
                                            setPagination(prev => ({ ...prev, page }));
                                            fetchUserBlogs();
                                        }}
                                        className={`px-4 py-2 rounded ${pagination.page === page
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyBlog; 