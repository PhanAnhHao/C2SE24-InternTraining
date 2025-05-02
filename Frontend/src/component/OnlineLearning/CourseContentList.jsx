import { useState } from "react";
import LessonItem from "./LessonItem";

// Dữ liệu mẫu (sau này chỉ cần thay bằng API)
export const mockData = [
    {
        id: 1,
        index: 1,
        title: "Mô hình Client - Server là gì?",
        duration: "",
        status: "active",
        videoUrl: "https://www.youtube.com/embed/Gu73YOrL-D4",
        description: `Tìm gia các ứng dụng của công nghệ học, chia sẻ và "thẩm thấu" xem sao có gì miềnh!`,
    },
    {
        id: 2,
        index: 2,
        title: "Domain là gì? Tên miền là gì?",
        duration: "",
        status: "active",
        videoUrl: "https://www.youtube.com/embed/FBF-xXX7nVM",
        description: "Học về domain và tên miền, các khái niệm cơ bản và ứng dụng thực tế.",
    },
    {
        id: 3,
        index: 3,
        title: "Đăng ký học Offline",
        duration: "",
        status: "active",
        videoUrl: "https://www.youtube.com/embed/Gu73YOrL-D4",
        description: "Thông tin về cách đăng ký học offline.",
    },
    {
        id: 4,
        index: 4,
        title: "Học IT cần tố chất gì?",
        duration: "",
        status: "locked",
        videoUrl: "https://www.youtube.com/embed/Gu73YOrL-D4",
        description: "Những tố chất cần thiết để thành công trong ngành IT.",
    },
    {
        id: 5,
        index: 5,
        title: "Sinh viên IT đi thực tập cần biết gì?",
        duration: "",
        status: "locked",
        videoUrl: "https://www.youtube.com/embed/sample-video-5",
        description: "Chuẩn bị cho sinh viên IT trước khi đi thực tập.",
    },
    {
        id: 6,
        index: 6,
        title: "Trải nghiệm làm việc tại doanh nghiệp",
        duration: "",
        status: "locked",
        videoUrl: "https://www.youtube.com/embed/Gu73YOrL-D4",
        description: "Chia sẻ kinh nghiệm làm việc tại các doanh nghiệp công nghệ.",
    },
];

const CourseContentList = ({ lessons = mockData, setSelectedLesson, selectedLesson }) => {
    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson); // Update the parent state (for VideoSection)
    };

    return (
        <div className="text-sm w-1/4 px-4 pt-4 bg-[#F3FAFF] min-h-screen border-l border-gray-300">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Course content</h3>
            <ul className="space-y-2">
                {lessons.map((lesson) => (
                    <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        onSelect={() => handleSelectLesson(lesson)}
                        isSelected={selectedLesson && lesson.id === selectedLesson.id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default CourseContentList;