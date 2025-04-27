import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
    const navigate = useNavigate();
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
        if (!formData.tags.trim()) {
            setError('At least one tag is required');
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
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('content', formData.content.trim());

            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            if (tagsArray.length === 0) {
                setError('At least one tag is required');
                setLoading(false);
                return;
            }

            formDataToSend.append('tags', JSON.stringify(tagsArray));
            formDataToSend.append('status', formData.status);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            // Thêm userId vào form data
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }
            formDataToSend.append('token', token);

            // Gửi request
            const response = await axios.post('http://localhost:5000/blogs', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // withCredentials: true,
            });

            if (response.data) {
                alert('Blog created successfully!');
                navigate('/blogs');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create blog. Please try again.';
            setError(errorMessage);
            console.error('Error creating blog:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>

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
                        Tags (comma-separated) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Web Development, React, JavaScript"
                    />
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
                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-40 rounded-lg"
                            />
                        </div>
                    )}
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
                        onClick={() => navigate('/blogs')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Creating...' : 'Create Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog; 