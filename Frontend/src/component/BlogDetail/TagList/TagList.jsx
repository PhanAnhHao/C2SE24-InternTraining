import React from "react";

const TagList = () => {
    const tags = ["Swift UI", "Mobile Development", "Tech", "Programming"];
    return (
        <div className="p-6 border-t border-gray-300">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex space-x-2 mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagList;