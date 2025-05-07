import React from 'react';

const Education = ({ education }) => {
    return (
        <div className="px-4 pb-4 ">
            <h3 className="text-lg font-semibold mb-4">Educational Background</h3>
            {education && education.length > 0 ? (
                <div className="flex justify-between gap-4 px-8">
                    {education.map((edu, index) => (
                        <div key={index} className="flex-1 mb-4 p-4 border rounded min-w-0">
                            <p className="text-sm font-medium text-gray-700">{edu.course}</p>
                            <p className="text-sm text-gray-500">Provider: {edu.provider}</p>
                            <p className="text-sm text-gray-500">Duration: {edu.duration}</p>
                            <p className="text-sm text-gray-500">Grade: {edu.grade}</p>
                            <a
                                href={edu.link || "#"}
                                className="text-blue-500 text-sm hover:underline mt-2 block"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Course
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No educational background available.</p>
            )}
        </div>
    );
};

export default Education;