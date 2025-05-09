import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBlog = () => {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        status: 'published',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [oldImage, setOldImage] = useState(null);

    const tagOptions = [
        "Web Development",
        "React",
        "Next.js",
        "JavaScript",
        "Frontend"
    ];

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/blogs/${blogId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const blog = res.data.blog;
                setFormData({
                    title: blog.title || '',
                    content: blog.content || '',
                    tags: blog.tags ? blog.tags[0] : '',
                    status: blog.status || 'published',
                    image: null
                });
                setOldImage(blog.image || null);
            } catch (err) {
                setError('Failed to fetch blog data.');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            // Tạo preview cho hình ảnh
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.content.trim()) {
            setError('Content is required');
            return false;
        }
        if (!formData.tags) {
            setError('Please select a tag');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validateForm()) return;
        setLoading(true);
        try {
            let imageUrl = oldImage; // Mặc định giữ ảnh cũ

            // Nếu có ảnh mới, upload trước
            if (formData.image) {
                const imgForm = new FormData();
                imgForm.append('image', formData.image);
                const token = localStorage.getItem('token');
                const res = await axios.put(
                    `http://localhost:5000/blogs/${blogId}/update-image`,
                    imgForm,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                imageUrl = res.data.blog.image; // Lấy URL ảnh mới từ response
            }

            // Chuẩn bị dữ liệu update blog (không gửi image nữa)
            const updateData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                tags: typeof formData.tags === 'string'
                    ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : formData.tags,
                status: formData.status,
            };
            if (imageUrl) updateData.image = imageUrl;

            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/blogs/${blogId}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert('Blog updated successfully!');
            navigate('/my-blog');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Update Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter blog title"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Write your blog content here..."
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">Select a tag</option>
                        {tagOptions.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Blog Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {/* Hiển thị preview ảnh mới hoặc ảnh cũ */}
                    {preview ? (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-40 rounded-lg"
                            />
                        </div>
                    ) : oldImage ? (
                        <div className="mt-2">
                            <img
                                src={`http://localhost:5000/uploads/blogs/${oldImage}`}
                                alt="Current Blog"
                                className="max-h-40 rounded-lg"
                            />
                        </div>
                    ) : null}
                </div>
                <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/my-blog')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Update Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBlog; 