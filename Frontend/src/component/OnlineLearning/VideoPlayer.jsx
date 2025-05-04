import { useState, useEffect, useRef } from "react";

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

const VideoPlayer = ({ videoUrl, title = "" }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const isCompletedRef = useRef(false); // Theo dõi trạng thái hoàn thành 80%

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
                    start: 0, // Bắt đầu từ 0 giây
                },
                events: {
                    onReady: (event) => {
                        const videoDuration = event.target.getDuration();
                        setDuration(videoDuration || 0);
                        setCurrentTime(0); // Reset currentTime khi player sẵn sàng
                        console.log(`Video ${videoId} duration: ${videoDuration}`);
                        event.target.seekTo(0); // Đảm bảo video bắt đầu từ 0
                    },
                    onError: (error) => {
                        console.error("Lỗi player:", error);
                        setDuration(0);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            // Reset currentTime nếu video bắt đầu phát từ đầu
                            if (Math.abs(event.target.getCurrentTime()) < 1) {
                                setCurrentTime(0);
                            }

                            let hasLogged80Percent = false;

                            const interval = setInterval(() => {
                                const time = event.target.getCurrentTime();
                                const totalDuration = event.target.getDuration();
                                setCurrentTime(time);

                                console.log(`Thời gian hiện tại: ${time}`);

                                if (!hasLogged80Percent && totalDuration && time / totalDuration >= 0.8) {
                                    hasLogged80Percent = true;
                                    console.log("✅ Đã xem hơn 80% video");
                                }
                            }, 3000);
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
        isCompletedRef.current = false; // Reset trạng thái hoàn thành khi videoUrl thay đổi
        setCurrentTime(0); // Reset currentTime khi videoUrl thay đổi

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

        return () => {
            if (playerRef.current?.interval) {
                clearInterval(playerRef.current.interval);
            }
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoUrl]);

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