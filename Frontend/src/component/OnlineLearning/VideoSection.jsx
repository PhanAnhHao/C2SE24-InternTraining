import VideoPlayer from "./VideoPlayer";
import VideoDescription from "./VideoDescription";

const VideoSection = ({ selectedLesson }) => {
    return (
        <div className="px-6 py-2 w-3/4">
            <VideoPlayer
                videoUrl={selectedLesson.videoUrl}
                title={selectedLesson.title.toUpperCase()}
                subtitle="Kiến thức nền tảng"
            />
            <div className="px-2">
                <VideoDescription
                    title={selectedLesson.title}
                    updateDate="11/2022" // You can make this dynamic if needed
                    description={selectedLesson.description}

                />
            </div>
        </div>
    );
};

export default VideoSection;