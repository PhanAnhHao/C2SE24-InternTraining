import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import YouTube from "react-youtube";

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
    const [showContinuePrompt, setShowContinuePrompt] = useState(false); // State cho thông báo "Bạn có muốn xem tiếp?"
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const isCompletedRef = useRef(false);
    const lastProgressRef = useRef({ progress: 0, watchTime: 0 });
    const updateTimeoutRef = useRef(null);
    const studentId = localStorage.getItem("studentId");

    // Lấy tiến độ ban đầu
    const fetchInitialProgress = useCallback(async () => {
        if (!studentId || !lessonId) {
            console.warn("Thiếu studentId hoặc lessonId", { studentId, lessonId });
            setError("Vui lòng đăng nhập để tiếp tục từ vị trí đã lưu");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/progress/${studentId}/${lessonId}`);
            const progressData = response.data || { watchTime: 0, status: "not_started", progress: 0 };
            // console.log("API response:", progressData);

            if (!progressData.watchTime || progressData.status === "not_started") {
                console.log("Người dùng chưa bắt đầu bài học, không cần khôi phục tiến độ.");
                return;
            }

            lastProgressRef.current = {
                progress: progressData.progress || 0,
                watchTime: progressData.watchTime || 0,
            };
            isCompletedRef.current = progressData.status === "completed";
            setCurrentTime(progressData.watchTime || 0);

            if (!isCompletedRef.current && progressData.watchTime > 0) {
                setShowContinuePrompt(true);
            }
            console.log("Khôi phục tiến độ video:", progressData);
        } catch (err) {
            // Chỉ ghi log lỗi nếu không phải 404
            if (err.response?.status !== 404) {
                console.error("Lỗi khi lấy tiến độ:", err.response?.data || err.message);
                setError("Không thể lấy tiến độ bài học");
            } else {
                console.log("Không có tiến độ, bắt đầu từ đầu.");
            }
        }
    }, [studentId, lessonId]);
    // Cập nhật tiến độ video
    const updateProgress = useCallback(async (progress, watchTime, status = "in_progress") => {
        if (!studentId || !lessonId || isCompletedRef.current) {
            console.warn("Không gọi API", { studentId, lessonId, isCompleted: isCompletedRef.current });
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/progress", {
                studentId,
                lessonId,
                status,
                progress,
                watchTime,
            });
            console.log(`Cập nhật tiến độ: ${status}, progress: ${progress}%, watchTime: ${watchTime}s`, response.data);
            if (status === "completed") {
                isCompletedRef.current = true;
                console.log("✅ Lesson marked as completed");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật tiến độ:", err.response?.data || err.message);
            setError("Không thể cập nhật tiến độ");
        }
    }, [studentId, lessonId]);

    // Debounce cập nhật tiến độ
    const debounceUpdateProgress = useCallback((progress, watchTime, status = "in_progress") => {
        lastProgressRef.current = { progress, watchTime };
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        updateTimeoutRef.current = setTimeout(() => {
            updateProgress(progress, watchTime, status);
        }, 2000);
    }, [updateProgress]);

    // Xử lý khi rời trang hoặc chuyển tab
    const handleVisibilityChange = useCallback(() => {
        if (document.visibilityState === "hidden" && !isCompletedRef.current) {
            const { progress, watchTime } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    }, [updateProgress]);

    const handleBeforeUnload = useCallback(() => {
        if (!isCompletedRef.current) {
            const { progress, watchTime } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    }, [updateProgress]);

    // Xử lý khi người dùng chọn "Có" (tiếp tục xem từ watchTime)
    const handleContinueYes = useCallback(() => {
        const watchTime = lastProgressRef.current.watchTime;
        const videoDuration = playerRef.current?.getDuration() || 0;
        if (watchTime > 0 && watchTime <= videoDuration) {
            playerRef.current.seekTo(watchTime, true);
            setCurrentTime(watchTime);
            setShowResumeMessage(true);
            setTimeout(() => setShowResumeMessage(false), 3000);
            // console.log(`Nhảy đến vị trí: ${watchTime}s`);
        }
        setShowContinuePrompt(false);
    }, []);

    // Xử lý khi người dùng chọn "Không" (chạy từ đầu)
    const handleContinueNo = useCallback(() => {
        playerRef.current.seekTo(0, true);
        setCurrentTime(0);
        lastProgressRef.current.watchTime = 0;
        setShowContinuePrompt(false);
    }, []);

    // Xử lý khi YouTube Player sẵn sàng
    const onReady = useCallback((event) => {
        playerRef.current = event.target;
        const videoDuration = event.target.getDuration();
        setDuration(videoDuration || 0);

        // Nếu video đã hoàn thành, chạy từ đầu
        if (isCompletedRef.current) {
            event.target.seekTo(0, true);
            setCurrentTime(0);
            lastProgressRef.current.watchTime = 0;
            // console.log("Video đã hoàn thành, chạy từ đầu");
        }
        // Nếu video ở trạng thái in_progress, chờ người dùng chọn "Có" hoặc "Không"
    }, []);

    // Xử lý khi trạng thái video thay đổi
    const onStateChange = useCallback((event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    const time = event.target.getCurrentTime();
                    const totalDuration = event.target.getDuration();
                    setCurrentTime(time);
                    if (totalDuration && !isCompletedRef.current) {
                        const progress = ((time / totalDuration) * 100).toFixed(2);
                        lastProgressRef.current = { progress, watchTime: time };
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
    }, [debounceUpdateProgress]);

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
        isCompletedRef.current = false;
        lastProgressRef.current = { progress: 0, watchTime: 0 };
        setCurrentTime(0);
        setError(null);
        setShowContinuePrompt(false);
        fetchInitialProgress();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            if (!isCompletedRef.current) {
                const { progress, watchTime } = lastProgressRef.current;
                if (progress > 0) {
                    updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
                }
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [videoUrl, lessonId, studentId, fetchInitialProgress, updateProgress, handleVisibilityChange, handleBeforeUnload]);

    const videoId = getVideoIdFromUrl(videoUrl);

    return (
        <div className="relative w-full rounded-lg overflow-hidden">
            {error && (
                <div className="absolute top-0 left-0 w-full p-4 bg-red-500 text-white text-center">
                    {error}
                </div>
            )}
            {showContinuePrompt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                        <p className="text-lg font-semibold">
                            Bạn có muốn xem tiếp từ {formatDuration(lastProgressRef.current.watchTime)}?
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleContinueYes}
                                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                            >
                                Có
                            </button>
                            <button
                                onClick={handleContinueNo}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showResumeMessage && (
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