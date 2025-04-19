import { useState } from "react";
import LessonHeader from "./LessonHeader.jsx";
const CreateLessonForm = ({ onSubmit, onCancel }) => {
    const [lessonNumber, setLessonNumber] = useState(1);
    const [lessonName, setLessonName] = useState("");
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");

    const handleSubmit = () => {
        const newLesson = {
            title: `Lesson ${lessonNumber}: `+ lessonName || `Lesson ${lessonNumber}: Untitled`,
            duration: "30 mins",
            color: `teal-300`, // Default color, can be adjusted
            description: desc,
            file: file,
        };
        onSubmit(newLesson);
        // Reset form
        setLessonNumber(1);
        setLessonName("");
        setFile(null);
        setDesc("");
    };

    return (
        <div>
                <LessonHeader/>
            <div className="bg-white h-[600px] p-6">
                <h2 className="font-bold  mb-2 text-gray-700 text-sm">Lesson Number</h2>
                <input
                    type="number"
                    value={lessonNumber}
                    onChange={(e) => setLessonNumber(e.target.value)}
                    className="w-full border border-[#D9D9D9] p-2 rounded mb-4 text-gray-700"
                />
                <h2 className="font-bold mb-2 text-gray-700 text-sm">Lesson Name</h2>
                <input
                    type="text"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    placeholder="Adobe XD Auto - Animate - Your Guide to Creating"
                    className="w-full border border-[#D9D9D9] p-2 rounded mb-4 text-gray-700 placeholder-gray-400"
                />
                <h2 className="font-bold mb-2 text-gray-700 text-sm">Upload File</h2>
                <div className="relative w-full mb-4">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full border border-[#D9D9D9] p-2 rounded text-gray-700"
                        accept=".mp4,.txt,.pdf,.docx,.jpg,.png"
                    />
                    <p className="text-xs text-gray-400 mt-1">mp4, txt, pdf, docx, jpg, png</p>
                </div>
                <h2 className="font-bold mb-2 text-gray-700 text-sm">Lesson Description</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod..."
                    className="w-full border border-[#D9D9D9] p-2 rounded mb-4 text-gray-700 placeholder-gray-400"
                    rows={4}
                />
                <div className="flex justify-end mt-2 gap-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 transition-colors text-gray-700 px-6 py-2 rounded font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-500 hover:bg-teal-600 transition-colors text-white px-6 py-2 rounded font-semibold"
                    >
                        Create Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLessonForm;