import VideoPlayer from "./VideoPlayer";
import VideoDescription from "./VideoDescription";

const VideoSection = ({ selectedLesson }) => {
    return (
        <div className="p-6 w-3/4">
            <VideoPlayer
                videoUrl={selectedLesson.videoUrl}
                title={selectedLesson.title.toUpperCase()}
                subtitle="Kiến thức nền tảng"
            />
            <VideoDescription
                title={selectedLesson.title}
                updateDate="11/2022" // You can make this dynamic if needed
                description={selectedLesson.description}

            />
        </div>
    );
};

export default VideoSection;