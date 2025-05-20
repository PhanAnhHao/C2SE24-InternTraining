import { useState, useEffect, useRef } from "react";
import axios from "axios";

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
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const isCompletedRef = useRef(false); // Track if lesson is completed
    const lastProgressRef = useRef({ progress: 0, watchTime: 0 }); // Store last progress locally
    const updateTimeoutRef = useRef(null); // Debounce API calls

    // Lấy studentId từ localStorage
    const studentId = localStorage.getItem("studentId");

    // Gọi API để kiểm tra trạng thái tiến độ ban đầu
    const fetchInitialProgress = async () => {
        if (!studentId || !lessonId) {
            console.warn("Thiếu studentId hoặc lessonId, không thể lấy tiến độ ban đầu", { studentId, lessonId });
            return;
        }

        try {
            // Giả sử có endpoint để lấy tiến độ cho một lesson cụ thể
            const response = await axios.get(`http://localhost:5000/progress/${studentId}/${lessonId}`);
            const progressData = response.data;

            if (progressData) {
                lastProgressRef.current = {
                    progress: progressData.progress || 0,
                    watchTime: progressData.watchTime || 0,
                };
                isCompletedRef.current = progressData.status === "completed";
                setCurrentTime(progressData.watchTime || 0); // Khôi phục vị trí cuối cùng
                console.log("Initial progress loaded:", progressData);
            }
        } catch (err) {
            console.error("Lỗi khi lấy tiến độ ban đầu:", err.response?.data || err.message);
        }
    };

    // Gọi API để cập nhật tiến độ video
    const updateProgress = async (progress, watchTime, status = "in_progress") => {
        if (!studentId || !lessonId || isCompletedRef.current) {
            console.warn("Không gọi API: Thiếu studentId, lessonId hoặc đã hoàn thành", { studentId, lessonId, isCompleted: isCompletedRef.current });
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
            console.error("Lỗi khi cập nhật tiến độ video:", err.response?.data || err.message);
        }
    };

    // Debounce cập nhật tiến độ
    const debounceUpdateProgress = (progress, watchTime, status = "in_progress") => {
        lastProgressRef.current = { progress, watchTime };
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        updateTimeoutRef.current = setTimeout(() => {
            updateProgress(progress, watchTime, status);
        }, 1000); // Debounce 1 giây
    };

    // Xử lý khi người dùng rời trang hoặc chuyển tab
    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden" && !isCompletedRef.current) {
            const { progress, watchTime } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    };

    const handleBeforeUnload = () => {
        if (!isCompletedRef.current) {
            const { progress, watchTime } = lastProgressRef.current;
            if (progress > 0) {
                updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
            }
        }
    };

    // Tạo player YouTube
    const createPlayer = () => {
        const videoId = getVideoIdFromUrl(videoUrl);
        if (!videoId || !window.YT || !window.YT.Player) {
            console.error("Không thể tạo player: videoId hoặc YouTube API không hợp lệ", { videoId, hasYT: !!window.YT });
            setDuration(0);
            return;
        }

        try {
            playerRef.current = new window.YT.Player(playerContainerRef.current, {
                height: "500",
                width: "100%",
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    start: lastProgressRef.current.watchTime || 0, // Bắt đầu từ vị trí cuối cùng
                },
                events: {
                    onReady: (event) => {
                        const videoDuration = event.target.getDuration();
                        setDuration(videoDuration || 0);
                        console.log(`Video ${videoId} duration: ${videoDuration}`);
                        event.target.seekTo(lastProgressRef.current.watchTime || 0);

                        // Cập nhật trạng thái "in_progress" nếu chưa hoàn thành
                        if (studentId && lessonId && !isCompletedRef.current) {
                            debounceUpdateProgress(lastProgressRef.current.progress || 0, lastProgressRef.current.watchTime || 0, "in_progress");
                        }
                    },
                    onError: (error) => {
                        console.error("Lỗi player:", error);
                        setDuration(0);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            const interval = setInterval(() => {
                                const time = event.target.getCurrentTime();
                                const totalDuration = event.target.getDuration();
                                setCurrentTime(time);

                                if (totalDuration && !isCompletedRef.current) {
                                    const progress = ((time / totalDuration) * 100).toFixed(2);
                                    lastProgressRef.current = { progress, watchTime: time };

                                    // Chỉ cập nhật nếu đạt hơn 80%
                                    if (progress >= 80) {
                                        debounceUpdateProgress(100, time, "completed");
                                        clearInterval(interval);
                                        playerRef.current.interval = null;
                                    }
                                }
                            }, 1000); // Cập nhật mỗi 1 giây
                            playerRef.current.interval = interval;
                        } else {
                            if (playerRef.current?.interval) {
                                clearInterval(playerRef.current.interval);
                                playerRef.current.interval = null;
                            }
                        }
                    },
                },
            });
        } catch (error) {
            console.error("Lỗi khi khởi tạo player:", error);
            setDuration(0);
        }
    };

    // Tải YouTube IFrame API và tạo player
    useEffect(() => {
        // Reset trạng thái
        isCompletedRef.current = false;
        lastProgressRef.current = { progress: 0, watchTime: 0 };
        setCurrentTime(0);

        // Lấy tiến độ ban đầu
        fetchInitialProgress();

        // Tải YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        // Thêm sự kiện visibilitychange và beforeunload
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            if (playerRef.current?.interval) {
                clearInterval(playerRef.current.interval);
            }
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            // Gọi API lần cuối khi component unmount
            if (!isCompletedRef.current) {
                const { progress, watchTime } = lastProgressRef.current;
                if (progress > 0) {
                    updateProgress(progress, watchTime, progress >= 80 ? "completed" : "in_progress");
                }
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [videoUrl, lessonId, studentId]); // Đảm bảo studentId là dependency

    return (
        <div className="relative w-full rounded-lg overflow-hidden">
            <div ref={playerContainerRef}></div>
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