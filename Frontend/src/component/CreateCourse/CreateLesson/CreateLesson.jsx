import { useState, useEffect } from "react";
import LessonHeader from "./LessonHeader.jsx";

const CreateLessonForm = ({ onSubmit, onCancel, editingLesson }) => {
    const [lessonNumber, setLessonNumber] = useState(1);
    const [lessonName, setLessonName] = useState("");
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({});

    // Khi editingLesson thay đổi, điền dữ liệu vào form
    useEffect(() => {
        if (editingLesson) {
            const { lesson } = editingLesson;
            // Giả sử title có dạng "Lesson X: Name"
            const match = lesson.title.match(/Lesson (\d+): (.+)/);
            if (match) {
                setLessonNumber(parseInt(match[1]));
                setLessonName(match[2]);
            } else {
                setLessonNumber(1);
                setLessonName(lesson.title);
            }
            setDesc(lesson.description || "");
            setFile(lesson.file || null);
        } else {
            // Reset form khi không chỉnh sửa
            setLessonNumber(1);
            setLessonName("");
            setFile(null);
            setDesc("");
            setErrors({});
        }
    }, [editingLesson]);

    const validateForm = () => {
        const newErrors = {};

        if (!lessonNumber || lessonNumber < 1) {
            newErrors.lessonNumber = "Lesson number must be a positive number.";
        }

        if (!lessonName.trim()) {
            newErrors.lessonName = "Lesson name is required.";
        }

        if (!file) {
            newErrors.file = "Please upload a file.";
        } else {
            const allowedExtensions = [".mp4", ".txt", ".pdf", ".docx", ".jpg", ".png"];
            const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                newErrors.file = "Invalid file format. Allowed: mp4, txt, pdf, docx, jpg, png.";
            }
        }

        if (!desc.trim()) {
            newErrors.desc = "Lesson description is required.";
        }

        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newLesson = {
            title: `Lesson ${lessonNumber}: ` + lessonName || `Lesson ${lessonNumber}: Untitled`,
            duration: "30 mins",
            color: `teal-300`,
            description: desc,
            file: file,
        };
        onSubmit(newLesson);

        // Reset form
        if (!editingLesson) {
            setLessonNumber(1);
            setLessonName("");
            setFile(null);
            setDesc("");
            setErrors({});
        }
    };

    return (
        <div>
            <LessonHeader />
            <div className="bg-white h-[600px] p-6">
                <h2 className="font-bold mb-2 text-gray-700 text-sm">Lesson Number</h2>
                <input
                    type="number"
                    value={lessonNumber}
                    onChange={(e) => setLessonNumber(e.target.value)}
                    className={`w-full border ${errors.lessonNumber ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4 text-gray-700`}
                />
                {errors.lessonNumber && <p className="text-red-500 text-xs mb-2">{errors.lessonNumber}</p>}

                <h2 className="font-bold mb-2 text-gray-700 text-sm">Lesson Name</h2>
                <input
                    type="text"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    placeholder="lesson name..."
                    className={`w-full border ${errors.lessonName ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4 text-gray-700 placeholder-gray-400`}
                />
                {errors.lessonName && <p className="text-red-500 text-xs mb-2">{errors.lessonName}</p>}

                <h2 className="font-bold mb-2 text-gray-700 text-sm">Upload File</h2>
                <div className="relative w-full mb-4">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className={`w-full border ${errors.file ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded text-gray-700`}
                        accept=".mp4,.txt,.pdf,.docx,.jpg,.png"
                    />
                    <p className="text-xs text-gray-400 mt-1">mp4, txt, pdf, docx, jpg, png</p>
                    {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                </div>

                <h2 className="font-bold mb-2 text-gray-700 text-sm">Lesson Description</h2>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Lesson description..."
                    className={`w-full border ${errors.desc ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4 text-gray-700 placeholder-gray-400`}
                    rows={4}
                />
                {errors.desc && <p className="text-red-500 text-xs mb-2">{errors.desc}</p>}

                <div className="flex justify-end mt-2 gap-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 transition-colors text-gray-700 px-6 py-2 rounded font-semibold"
                    >
                        {editingLesson ? "Cancel Edit" : "Cancel"}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-500 hover:bg-teal-600 transition-colors text-white px-6 py-2 rounded font-semibold"
                    >
                        {editingLesson ? "Update Lesson" : "Create Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLessonForm;