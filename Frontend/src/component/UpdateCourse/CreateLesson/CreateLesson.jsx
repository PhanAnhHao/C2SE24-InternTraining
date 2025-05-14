import { useState, useEffect } from "react";
import LessonHeader from "./LessonHeader.jsx";
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "notistack";

const CreateLessonForm = ({ onSubmit, onCancel, editingLesson }) => {
    const [lessonNumber, setLessonNumber] = useState(1);
    const [lessonName, setLessonName] = useState("");
    const [linkVideo, setLinkVideo] = useState("");
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({});

    const { enqueueSnackbar } = useSnackbar();

    // Khi editingLesson thay đổi, điền dữ liệu vào form
    useEffect(() => {
        if (editingLesson) {
            const { lesson } = editingLesson;
            const match = lesson.name.match(/Lesson (\d+): (.+)/);
            if (match) {
                setLessonNumber(parseInt(match[1]));
                setLessonName(match[2]);
            } else {
                setLessonNumber(1);
                setLessonName(lesson.name);
            }
            setDesc(lesson.content || ""); // Đổi description thành content
            setLinkVideo(lesson.linkVideo || ""); // Điền linkVideo
        } else {
            setLessonNumber(1);
            setLessonName("");
            setLinkVideo("");
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

        if (!linkVideo.trim()) {
            newErrors.linkVideo = "Video link is required.";
        } else {
            // Kiểm tra định dạng URL (tùy chọn)
            const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
            if (!urlPattern.test(linkVideo)) {
                newErrors.linkVideo = "Please enter a valid URL (e.g., https://example.com).";
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
            enqueueSnackbar("Please fix the errors in the form.", { variant: "error" });
            return;
        }

        const newLesson = {
            idLesson: uuidv4(),
            name: `Lesson ${lessonNumber}: ` + lessonName || `Lesson ${lessonNumber}: Untitled`,
            content: desc,
            linkVideo: linkVideo,
            status: "draft",
        };

        onSubmit(newLesson);

        if (!editingLesson) {
            setLessonNumber(1);
            setLessonName("");
            setLinkVideo("");
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

                <h2 className="font-bold mb-2 text-gray-700 text-sm">Video Link</h2>
                <div className="relative w-full mb-4">
                    <input
                        type="text"
                        value={linkVideo}
                        onChange={(e) => setLinkVideo(e.target.value)}
                        placeholder="Paste video link here (e.g., https://example.com/video.mp4)"
                        className={`w-full border ${errors.linkVideo ? "border-red-500" : "border-[#D9D9D9]"} p-2 rounded mb-4 text-gray-700 placeholder-gray-400`}
                    />
                    {errors.linkVideo && <p className="text-red-500 text-xs mb-2">{errors.linkVideo}</p>}
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