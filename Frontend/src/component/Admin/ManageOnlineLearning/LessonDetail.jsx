import React, { useEffect, useState } from "react";
import axios from "axios";

const LessonDetail = ({ lessonId, onClose }) => {
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/lessons/${lessonId}`);
                setLesson(res.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài học:", error);
            }
        };
        fetchLesson();
    }, [lessonId]);

    if (!lesson) return (
        <div className="fixed  flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
                <p className="text-gray-500 italic">Đang tải chi tiết bài học...</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0  ml-[200px] mt-[100px] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📘 Chi tiết bài học</h3>
                <p><strong>ID Bài học:</strong> {lesson.idLesson}</p>
                <p><strong>Tên bài học:</strong> {lesson.name}</p>
                <p><strong>Nội dung:</strong> {lesson.content}</p>
                <p><strong>Trạng thái:</strong> {lesson.status}</p>
                <p><strong>Khóa học:</strong> {lesson.idCourse?.idCourse}</p>
                <p><strong>Bài kiểm tra liên kết:</strong> {lesson.idTest?.idTest}</p>

                {lesson.linkVideo && (
                    <div className="mt-4">
                        <strong>Video bài học:</strong>
                        <div className="mt-2 aspect-video">
                            <iframe
                                className="w-full h-full rounded"
                                src={lesson.linkVideo.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
                                title="Video bài học"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
