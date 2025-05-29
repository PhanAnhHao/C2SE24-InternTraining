import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux"; // Thêm useDispatch và useSelector
import { updateLessonProgress } from "../../redux/slices/lessonSlice";

// Hàm lấy video ID từ URL YouTube
const getVideoIdFromUrl = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Hàm định dạng thời gian từ giây thành MM:SS
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const VideoPlayer = ({ videoUrl, title = "", lessonId }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(null);
    const [showResumeMessage, setShowResumeMessage] = useState(false);
    const [showContinuePrompt, setShowContinuePrompt] = useState(false);
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const lastProgressRef = useRef({ progress: 0, watchTime: 0, status: "not_started" });
    const updateTimeoutRef = useRef(null);
    const studentId = localStorage.getItem("studentId");
    const userRole = localStorage.getItem("role");
    const isStudent = userRole === "Student";
    const dispatch = useDispatch(); // Thêm dispatch
    const { lessons } = useSelector((state) => state.lessons); // Lấy lessons từ Redux store

    // Lấy trạng thái completed từ Redux store
    const lesson = lessons.find((l) => l._id === lessonId);
    const isCompletedFromStore = lesson?.progress?.status === "completed";

    // Lấy tiến độ ban đầu (chỉ cho student)
    const fetchInitialProgress = useCallback(async () => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua fetchInitialProgress");
            return;
        }
        if (!studentId || !lessonId) {
            console.warn("Thiếu studentId hoặc lessonId", { studentId, lessonId });
            setError("Vui lòng đăng nhập để tiếp tục từ vị trí đã lưu");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/progress/${studentId}/${lessonId}`);
            const progressData = response.data || { watchTime: 0, status: "not_started", progress: 0 };

            if (!progressData.watchTime || progressData.status === "not_started") {
                console.log("Người dùng chưa bắt đầu bài học, không cần khôi phục tiến độ.");
                return;
            }

            lastProgressRef.current = {
                progress: progressData.progress || 0,
                watchTime: progressData.watchTime || 0,
                status: progressData.status || "not_started",
            };
            setCurrentTime(progressData.watchTime || 0);

            // Cập nhật Redux store với tiến độ ban đầu
            dispatch(updateLessonProgress({
                lessonId,
                progress: progressData.progress || 0,
                watchTime: progressData.watchTime || 0,
                status: progressData.status || "not_started",
            }));

            if (!isCompletedFromStore && progressData.watchTime > 0) {
                setShowContinuePrompt(true);
            }
            console.log("Khôi phục tiến độ video:", progressData);
        } catch (err) {
            if (err.response?.status !== 404) {
                console.error("Lỗi khi lấy tiến độ:", err.response?.data || err.message);
                setError("Không thể lấy tiến độ bài học");
            } else {
                console.log("Không có tiến độ, bắt đầu từ đầu.");
            }
        }
    }, [studentId, lessonId, isStudent, dispatch, isCompletedFromStore]);

    // Cập nhật tiến độ video (chỉ cho student)
    const updateProgress = useCallback(async (progress, watchTime, status = "in_progress") => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua updateProgress");
            return;
        }
        if (!studentId || !lessonId || isCompletedFromStore) {
            console.warn("Không gọi API", { studentId, lessonId, isCompleted: isCompletedFromStore });
            return;
        }
        try {
            // Optimistic update: Cập nhật Redux trước khi gọi API
            dispatch(updateLessonProgress({ lessonId, progress, watchTime, status }));

            const response = await axios.post("http://localhost:5000/progress", {
                studentId,
                lessonId,
                status,
                progress,
                watchTime,
            });
            console.log(`Cập nhật tiến độ: ${status}, progress: ${progress}%, watchTime: ${watchTime}s`, response.data);
            if (status === "completed") {
                console.log("✅ Lesson marked as completed");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật tiến độ:", err.response?.data || err.message);
            setError("Không thể cập nhật tiến độ");
            // Rollback Redux nếu API thất bại
            dispatch(updateLessonProgress({
                lessonId,
                progress: lastProgressRef.current.progress,
                watchTime: lastProgressRef.current.watchTime,
                status: lastProgressRef.current.status || "in_progress",
            }));
        }
    }, [studentId, lessonId, isStudent, dispatch, isCompletedFromStore]);

    // Debounce cập nhật tiến độ (chỉ cho student)
    const debounceUpdateProgress = useCallback((progress, watchTime, status = "in_progress") => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua debounceUpdateProgress");
            return;
        }
        lastProgressRef.current = { progress, watchTime, status };
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        // Cập nhật Redux ngay lập tức để UI phản ánh nhanh
        dispatch(updateLessonProgress({ lessonId, progress, watchTime, status }));
        updateTimeoutRef.current = setTimeout(() => {
            updateProgress(progress, watchTime, status);
        }, 2000);
    }, [updateProgress, isStudent, dispatch, lessonId]);

    // Xử lý khi rời trang hoặc chuyển tab (chỉ cho student)
    const handleVisibilityChange = useCallback(() => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua handleVisibilityChange");
            return;
        }
        if (document.visibilityState === "hidden" && !isCompletedFromStore) {
            const { progress, watchTime, status } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    }, [updateProgress, isStudent, isCompletedFromStore]);

    const handleBeforeUnload = useCallback(() => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua handleBeforeUnload");
            return;
        }
        if (!isCompletedFromStore) {
            const { progress, watchTime, status } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    }, [updateProgress, isStudent, isCompletedFromStore]);

    // Xử lý khi người dùng chọn "Có" (tiếp tục xem từ watchTime)
    const handleContinueYes = useCallback(() => {
        if (!isStudent) {
            console.log("Không phải student, bỏ qua handleContinueYes");
            setShowContinuePrompt(false);
            return;
        }
        const watchTime = lastProgressRef.current.watchTime;
        const videoDuration = playerRef.current?.getDuration() || 0;
        if (watchTime > 0 && watchTime <= videoDuration) {
            playerRef.current.seekTo(watchTime, true);
            setCurrentTime(watchTime);
            setShowResumeMessage(true);
            setTimeout(() => setShowResumeMessage(false), 3000);
        }
        setShowContinuePrompt(false);
    }, [isStudent]);

    // Xử lý khi người dùng chọn "Không" (chạy từ đầu)
    const handleContinueNo = useCallback(() => {
        playerRef.current.seekTo(0, true);
        setCurrentTime(0);
        lastProgressRef.current = { progress: 0, watchTime: 0, status: "not_started" };
        dispatch(updateLessonProgress({
            lessonId,
            progress: 0,
            watchTime: 0,
            status: "not_started",
        }));
        setShowContinuePrompt(false);
    }, [dispatch, lessonId]);

    // Xử lý khi YouTube Player sẵn sàng
    const onReady = useCallback((event) => {
        playerRef.current = event.target;
        const videoDuration = event.target.getDuration();
        setDuration(videoDuration || 0);

        if (isStudent && isCompletedFromStore) {
            event.target.seekTo(0, true);
            setCurrentTime(0);
            lastProgressRef.current = { progress: 0, watchTime: 0, status: "not_started" };
            dispatch(updateLessonProgress({
                lessonId,
                progress: 0,
                watchTime: 0,
                status: "not_started",
            }));
        }
    }, [isStudent, dispatch, lessonId, isCompletedFromStore]);

    // Xử lý khi trạng thái video thay đổi
    const onStateChange = useCallback((event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    const time = event.target.getCurrentTime();
                    const totalDuration = event.target.getDuration();
                    setCurrentTime(time);
                    if (isStudent && totalDuration && !isCompletedFromStore) {
                        const progress = ((time / totalDuration) * 100).toFixed(2);
                        lastProgressRef.current = { progress, watchTime: time, status: progress >= 80 ? "completed" : "in_progress" };
                        if (progress >= 80) {
                            debounceUpdateProgress(100, time, "completed");
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        } else {
                            const lastProgress = lastProgressRef.current.progress;
                            if (Math.abs(progress - lastProgress) >= 5) {
                                debounceUpdateProgress(progress, time, "in_progress");
                            }
                        }
                    }
                }, 1000);
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [debounceUpdateProgress, isStudent, isCompletedFromStore]);

    // Xử lý lỗi từ YouTube Player
    const onError = useCallback((event) => {
        const errorCode = event.data;
        let errorMessage = "Lỗi khi tải video";
        if (errorCode === 100) {
            errorMessage = "Video không tồn tại hoặc đã bị xóa";
        } else if (errorCode === 101 || errorCode === 150) {
            errorMessage = "Video không được phép nhúng";
        }
        console.error("Lỗi YouTube Player:", { errorCode, message: errorMessage });
        setError(errorMessage);
        setDuration(0);
    }, []);

    useEffect(() => {
        lastProgressRef.current = { progress: 0, watchTime: 0, status: "not_started" };
        setCurrentTime(0);
        setError(null);
        setShowContinuePrompt(false);

        if (isStudent) {
            fetchInitialProgress();
            document.addEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            if (isStudent && !isCompletedFromStore) {
                const { progress, watchTime, status } = lastProgressRef.current;
                if (progress > 0) {
                    updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
                }
            }
            if (isStudent) {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                window.removeEventListener("beforeunload", handleBeforeUnload);
            }
        };
    }, [videoUrl, lessonId, studentId, fetchInitialProgress, updateProgress, handleVisibilityChange, handleBeforeUnload, isStudent, isCompletedFromStore]);

    const videoId = getVideoIdFromUrl(videoUrl);

    return (
        <div className="relative w-full rounded-lg overflow-hidden">
            {error && (
                <div className="absolute top-0 left-0 w-full p-4 bg-red-500 text-white text-center">
                    {error}
                </div>
            )}
            {isStudent && showContinuePrompt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                        <p className="text-lg font-semibold">
                            Would you like to continue watching from {formatDuration(lastProgressRef.current.watchTime)}?
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleContinueYes}
                                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleContinueNo}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isStudent && showResumeMessage && (
                <div className="absolute top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded">
                    Tiếp tục từ {formatDuration(lastProgressRef.current.watchTime)}
                </div>
            )}
            {videoId ? (
                <YouTube
                    videoId={videoId}
                    opts={{
                        height: "500",
                        width: "100%",
                        playerVars: {
                            autoplay: 0,
                            controls: 1,
                            rel: 0,
                            modestbranding: 1,
                        },
                    }}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    onError={onError}
                />
            ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-gray-200">
                    <p className="text-red-500">Không thể tải video: URL không hợp lệ</p>
                </div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded">
                <h1 className="text-white text-xl md:text-2xl font-bold">{title}</h1>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded">
                <p className="text-white">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                </p>
            </div>
        </div>
    );
};

export default VideoPlayer;