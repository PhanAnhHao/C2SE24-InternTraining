import { useState, useEffect, useRef } from "react";
import VideoSection from "../component/OnlineLearning/VideoSection.jsx";
import CourseContentList from "../component/OnlineLearning/CourseContentList.jsx";
import Header from "../component/OnlineLearning/Header.jsx";
import LessonNavigation from "../component/OnlineLearning/LessonNavigation.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getLessonDataByCourseId } from "../redux/slices/lessonSlice.js";
import { useParams } from "react-router-dom";

const OnlineLearningPage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const { courseId } = useParams();
    const dispatch = useDispatch();
    const { lessons, singleLessonData, loading, error } = useSelector((state) => state.lessons); // Sửa state.lessons thành state.lesson

    useEffect(() => {
        if (courseId) {
            dispatch(getLessonDataByCourseId(courseId));
            // Reset selectedLesson khi chuyển khóa học mới
            setSelectedLesson(null);
            setCurrentLessonIndex(0);
        }
    }, [courseId, dispatch]);

    useEffect(() => {
        if (lessons && lessons.length > 0 && !selectedLesson) {
            setSelectedLesson(lessons[0]);
            setCurrentLessonIndex(0);
        }
    }, [lessons, selectedLesson]);

    const handlePreviousLesson = () => {
        if (currentLessonIndex > 0) {
            const newIndex = currentLessonIndex - 1;
            setCurrentLessonIndex(newIndex);
            setSelectedLesson(lessons[newIndex]);
        }
    };

    const handleNextLesson = () => {
        if (currentLessonIndex < lessons.length - 1) {
            const nextIndex = currentLessonIndex + 1;
            const nextLesson = lessons[nextIndex];

            // Kiểm tra trạng thái khóa (nếu cần)
            // if (nextLesson.status === "locked") {
            //   alert("Bạn cần phải hoàn thành bài học trước để mở khóa bài này!");
            //   return;
            // }

            setCurrentLessonIndex(nextIndex);
            setSelectedLesson(nextLesson);
        }
    };

    const contentRef = useRef(null);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Header cố định ở đầu trang */}
            <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
                <Header lessons={lessons} courseId={courseId} />
            </div>

            <div className="flex flex-1 mt-14">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p>Đang tải...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-500">Lỗi: {error}</p>
                    </div>
                ) : selectedLesson ? (
                    <VideoSection selectedLesson={selectedLesson} />
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p>Không có bài học nào được chọn</p>
                    </div>
                )}
                <CourseContentList
                    setSelectedLesson={setSelectedLesson}
                    selectedLesson={selectedLesson}
                    setCurrentLessonIndex={setCurrentLessonIndex}
                    currentLessonIndex={currentLessonIndex}
                    contentRef={contentRef}
                />
            </div>
            <LessonNavigation
                currentLessonIndex={currentLessonIndex}
                totalLessons={lessons.length}
                onPrevious={handlePreviousLesson}
                onNext={handleNextLesson}
            />
        </div>
    );
};

export default OnlineLearningPage;