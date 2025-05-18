import React, { useState } from 'react';
import { FaFileUpload, FaPen, FaFile } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadCV = ({ currentCV, onUploadSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type silently
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type) || file.size > 1 * 1024 * 1024) {
            return;
        }

        setSelectedFile(file);
    };

    const uploadNewCV = async (formData, token) => {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5000/users/upload-cv',
            data: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };

    const updateExistingCV = async (formData, token) => {
        const response = await axios({
            method: 'put',
            url: 'http://localhost:5000/users/update-cv',
            data: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };

    const handleSave = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', selectedFile);

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            let response;
            if (currentCV) {
                response = await updateExistingCV(formData, token);
            } else {
                response = await uploadNewCV(formData, token);
            }

            if (response.status === 200 && response.data.cv) {
                toast.success('CV uploaded successfully!', {
                    autoClose: 2000,
                    onClose: () => window.location.reload()
                });
            }
        } catch (error) {
            console.error('CV operation error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="cv-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="cv-upload"
                        className="flex items-center gap-2 cursor-pointer text-teal-500 hover:text-teal-600"
                    >
                        {currentCV ? (
                            <>
                                <FaPen className="w-4 h-4" />
                                <span>Update CV</span>
                            </>
                        ) : (
                            <>
                                <FaFileUpload className="w-4 h-4" />
                                <span>Upload CV</span>
                            </>
                        )}
                    </label>
                </div>

                {selectedFile && (
                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {isUploading ? 'Saving...' : 'Save CV'}
                    </button>
                )}
            </div>

            {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaFile className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                </div>
            )}
        </div>
    );
};

export default UploadCV;

// In Profile.jsx
<UploadCV
    currentCV={''} // Thêm cvFileName từ profile data
    onUploadSuccess={(fileData) => {
        setCvUrl(fileData);
        fetchProfile();
    }}
/>

