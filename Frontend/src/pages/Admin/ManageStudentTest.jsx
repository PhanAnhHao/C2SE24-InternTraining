import { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { useSnackbar } from "notistack";

const ManageStudentTest = () => {
    const [tests, setTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [questions, setQuestions] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        idTest: '',
        idLesson: '',
        content: '',
        idQuestion: []
    });

    const testsPerPage = 10;
    const totalPages = Math.ceil(tests.length / testsPerPage);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

    useEffect(() => {
        fetchTests();
        fetchLessons();
        fetchQuestions();
    }, []);
    const fetchTests = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tests");
            setTests(response.data);
        } catch (error) {
            enqueueSnackbar("Failed to fetch tests", { variant: "error" });
            console.error("Error fetching tests:", error);
        }
    };

    const fetchLessons = async () => {
        try {
            const response = await axios.get("http://localhost:5000/lessons");
            setLessons(response.data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/questions");
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this test?")) {
            try {
                await axios.delete(`http://localhost:5000/tests/${id}`);
                setTests(tests.filter(test => test._id !== id));
                enqueueSnackbar("Test deleted successfully", { variant: "success" });
            } catch (error) {
                enqueueSnackbar("Failed to delete test", { variant: "error" });
                console.error("Error deleting test:", error);
            }
        }
    };

    const handleEditClick = (test) => {
        setEditingId(test._id);
        setEditForm({
            idTest: test.idTest,
            idLesson: test.idLesson._id,
            content: test.content,
            idQuestion: test.idQuestion.map(q => q._id)
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditQuestionChange = (e) => {
        const { value } = e.target;
        setEditForm(prev => ({
            ...prev,
            idQuestion: Array.from(e.target.selectedOptions, option => option.value)
        }));
    };

    const validateEditTestForm = () => {
        const { idTest, idLesson, content } = editForm;

        if (!idTest || !idLesson || !content) {
            enqueueSnackbar("Please fill in all required fields", { variant: "warning" });
            return false;
        }

        if (content.trim() === "") {
            enqueueSnackbar("Content cannot be empty", { variant: "warning" });
            return false;
        }

        return true;
    };

    const handleEditSubmit = async () => {
        if (!validateEditTestForm()) return;

        try {
            await axios.put(`http://localhost:5000/tests/${editingId}`, editForm);
            fetchTests();
            setEditingId(null);
            enqueueSnackbar("Test updated successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to update test", { variant: "error" });
            console.error("Error updating test:", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleQuestionChange = (e) => {
        // For multi-select of questions
        setForm(prev => ({
            ...prev,
            idQuestion: Array.from(e.target.selectedOptions, option => option.value)
        }));
    };

    const validateForm = () => {
        const { idTest, idLesson, content } = form;

        if (!idTest || !idLesson || !content) {
            enqueueSnackbar("Please fill in all required fields", { variant: "warning" });
            return false;
        }

        if (content.trim() === "") {
            enqueueSnackbar("Content cannot be empty", { variant: "warning" });
            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:5000/tests", form);
            fetchTests();
            setForm({
                idTest: '',
                idLesson: '',
                content: '',
                idQuestion: []
            });
            setShowForm(false);
            enqueueSnackbar("Test added successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to add test", { variant: "error" });
            console.error("Error adding test:", error);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                    <FaClipboardList className="text-[#4FD1C5] mr-2" /> Manage Student Tests
                </h1>

                <div className="flex justify-end mb-4 mt-4">
                    <button
                        onClick={() => {
                            setForm({
                                idTest: '',
                                idLesson: '',
                                content: '',
                                idQuestion: []
                            });
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-[#4FD1C5] text-white rounded hover:bg-teal-500 transition"
                    >
                        + Add New Test
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Add New Test</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test ID</label>
                                <input
                                    type="text"
                                    name="idTest"
                                    value={form.idTest}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter test ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
                                <select
                                    name="idLesson"
                                    value={form.idLesson}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select a lesson</option>
                                    {lessons.map(lesson => (
                                        <option key={lesson._id} value={lesson._id}>
                                            {lesson.idLesson} - {lesson.content}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <input
                                    type="text"
                                    name="content"
                                    value={form.content}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter test content"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                                <select
                                    multiple
                                    name="idQuestion"
                                    value={form.idQuestion}
                                    onChange={handleQuestionChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                                >
                                    {questions.map(question => (
                                        <option key={question._id} value={question._id}>
                                            {question.idQuestion} - {question.content?.substring(0, 50) || 'Không có nội dung'}...
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple questions</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-[#4FD1C5] text-white rounded-md hover:bg-teal-500"
                            >
                                Add Test
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[#4FD1C5] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Test ID</th>
                                <th className="py-3 px-4 text-left">Lesson ID</th>
                                <th className="py-3 px-4 text-left">Content</th>
                                <th className="py-3 px-4 text-left">Questions</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTests.map((test, index) => (
                                <tr key={test._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="py-3 px-4">{test.idTest}</td>
                                    <td className="py-3 px-4">
                                        {editingId === test._id ? (
                                            <select
                                                name="idLesson"
                                                value={editForm.idLesson}
                                                onChange={handleEditChange}
                                                className="w-full border p-1 rounded"
                                            >
                                                {lessons.map(lesson => (
                                                    <option key={lesson._id} value={lesson._id}>
                                                        {lesson.idLesson}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            test.idLesson.idLesson
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editingId === test._id ? (
                                            <input
                                                name="content"
                                                value={editForm.content}
                                                onChange={handleEditChange}
                                                className="border p-1 rounded w-full"
                                            />
                                        ) : (
                                            test.content
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editingId === test._id ? (
                                            <select
                                                multiple
                                                name="idQuestion"
                                                value={editForm.idQuestion}
                                                onChange={handleEditQuestionChange}
                                                className="border p-1 rounded w-full h-20"
                                            >
                                                {questions.map(question => (
                                                    <option key={question._id} value={question._id}>
                                                        {question.idQuestion}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="max-h-20 overflow-y-auto">
                                                {test.idQuestion.map((q, i) => (
                                                    <div key={i} className="text-sm">
                                                        {q.idQuestion}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 space-x-2">
                                        {editingId === test._id ? (
                                            <>
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                    onClick={handleEditSubmit}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                    onClick={() => handleEditClick(test)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                    onClick={() => handleDelete(test._id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageStudentTest;