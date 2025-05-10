import VideoPlayer from "./VideoPlayer";
import VideoDescription from "./VideoDescription";
import { formatToVietnamTime } from "../../utils/dayFormat";

const VideoSection = ({ selectedLesson }) => {
    return (
        <div className="px-6 py-2 w-3/4">
            <VideoPlayer
                videoUrl={selectedLesson.linkVideo}
                title={selectedLesson.name.toUpperCase()}
                subtitle="Kiến thức nền tảng"
            />
            <div className="px-2">
                <VideoDescription
                    title={selectedLesson.name}
                    updateDate={formatToVietnamTime(selectedLesson.updatedAt)} // You can make this dynamic if needed
                    description={selectedLesson.content}

                />
            </div>
        </div>
    );
};

export default VideoSection;