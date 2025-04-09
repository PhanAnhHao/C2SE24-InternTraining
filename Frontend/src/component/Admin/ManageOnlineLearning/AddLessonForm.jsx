import React, { useState } from "react";

const AddLessonForm = ({ onClose, onSave }) => {
    const [lessonData, setLessonData] = useState({
        title: "",
        description: "",
        videoFile: null,
        documentFile: null,
        time: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonData({ ...lessonData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setLessonData({ ...lessonData, [name]: files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(lessonData);
        onClose();
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-1/2 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add new lesson</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Tiêu đề bài học */}
                    <div>
                        <label className="block text-gray-700 font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={lessonData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            required
                        />
                    </div>

                    {/* Giới thiệu */}
                    <div>
                        <label className="block text-gray-700 font-medium">Giới thiệu</label>
                        <textarea
                            name="description"
                            value={lessonData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition min-h-[100px]"
                        ></textarea>
                    </div>

                    {/* Upload video */}
                    <div>
                        <label className="block text-gray-700 font-medium">Upload video</label>
                        <input
                            type="file"
                            name="videoFile"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />
                    </div>

                    {/* Upload tài liệu */}
                    <div>
                        <label className="block text-gray-700 font-medium">Upload document</label>
                        <input
                            type="file"
                            name="documentFile"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#4FD1C5] text-white rounded-lg shadow hover:bg-[#38B2AC] transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLessonForm;
