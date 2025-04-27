// components/VideoDescription.jsx

const VideoDescription = ({ title, updateDate, description, links = [] }) => {
    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500 mt-1">Cập nhật chương trình {updateDate}</p>
            <p className="mt-4 text-gray-700 whitespace-pre-line">{description}</p>

            {/* Links */}
            <ul className="mt-4 space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        • <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.label}</a>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default VideoDescription;
