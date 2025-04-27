
const VideoPlayer = ({ videoUrl, title = "", subtitle = "" }) => {
    return (
        <div className="relative w-full bg-black rounded-lg overflow-hidden">
            {/* Video Embed */}
            <iframe
                className="w-full h-[450px]"
                src={videoUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            {/* Title nằm trên video nhưng không che */}
            <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded">
                <h1 className="text-white text-xl md:text-2xl font-bold">{title}</h1>
                {subtitle && (
                    <p className="text-white text-sm">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
