import { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
    TextField,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { createTest } from '../../redux/slices/testSlice';

const ManageStudentTest = () => {
    const [tests, setTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [lessons, setLessons] = useState([]);
    // const [questions, setQuestions] = useState([]);
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
        // fetchQuestions();
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

    // const fetchQuestions = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:5000/questions");
    //         setQuestions(response.data);
    //     } catch (error) {
    //         console.error("Error fetching questions:", error);
    //     }
    // };

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

    // const handleQuestionChange = (e) => {
    //     // For multi-select of questions
    //     setForm(prev => ({
    //         ...prev,
    //         idQuestion: Array.from(e.target.selectedOptions, option => option.value)
    //     }));
    // };

    const validateForm = () => {
        const { idTest, idLesson, content } = form;

        if (!idTest || !content) {
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


    // Add question
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.tests);
    const [questions, setQuestions] = useState([{

        idTest: "", // sẽ gán khi submit
        question: "",
        options: [""],
        correctAnswerIndex: 0,
    },]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                idQuestion: "",
                idTest: "", // sẽ gán khi submit
                question: "",
                options: [""],
                correctAnswerIndex: 0,
            },
        ]);
    };

    const removeQuestion = (qIndex) => {
        const updated = [...questions];
        updated.splice(qIndex, 1);
        setQuestions(updated);
    };

    const handleQuestionChange = (qIndex, value) => {
        const updated = [...questions];
        updated[qIndex].question = value;
        setQuestions(updated);
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[aIndex] = value;
        setQuestions(updated);
    };

    const addAnswer = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push("");
        setQuestions(updated);
    };

    const removeAnswer = (qIndex, aIndex) => {
        const updated = [...questions];
        updated[qIndex].options.splice(aIndex, 1);

        if (updated[qIndex].correctAnswerIndex === aIndex) {
            updated[qIndex].correctAnswerIndex = 0;
        } else if (updated[qIndex].correctAnswerIndex > aIndex) {
            updated[qIndex].correctAnswerIndex -= 1;
        }

        setQuestions(updated);
    };

    const handleCorrectChange = (qIndex, aIndex) => {
        const updated = [...questions];
        updated[qIndex].correctAnswerIndex = aIndex;
        setQuestions(updated);
    };

    const handleSaveTest = () => {
        const testId = form.idTest;

        if (!testId || !form.content) {
            alert("Vui lòng điền đầy đủ thông tin Test ID và nội dung bài test.");
            return;
        }

        const finalQuestions = questions.map((q, index) => ({
            idQuestion: `Q_${testId}_${index + 1}`,
            idTest: testId,
            question: q.question,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
        }));

        const testPayload = {
            idTest: testId,
            content: form.content,
            questions: finalQuestions,
        };

        console.log("Payload to submit:", testPayload);

        dispatch(createTest(testPayload));
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
                                {questions.map((question, qIndex) => (
                                    <Card key={qIndex} className="mb-4 w-full">
                                        <CardContent>
                                            <div className="flex justify-between items-center mb-2">
                                                <Typography variant="h6">Question {qIndex + 1}</Typography>
                                                <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
                                                    <Delete />
                                                </IconButton>
                                            </div>

                                            <TextField
                                                fullWidth
                                                label="Question Content"
                                                value={question.question}
                                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                margin="normal"
                                            />

                                            {question.options.map((option, aIndex) => (
                                                <div key={aIndex} className="flex items-center gap-4 mb-3">
                                                    <TextField
                                                        label={`Answer ${aIndex + 1}`}
                                                        value={option}
                                                        onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                                        fullWidth
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={question.correctAnswerIndex === aIndex}
                                                                onChange={() => handleCorrectChange(qIndex, aIndex)}
                                                            />
                                                        }
                                                        label="Correct"
                                                    />
                                                    <IconButton onClick={() => removeAnswer(qIndex, aIndex)}>
                                                        <Delete />
                                                    </IconButton>
                                                </div>
                                            ))}

                                            <Button onClick={() => addAnswer(qIndex)} startIcon={<Add />} sx={{ color: "#4FD1C5" }}>
                                                Add Answer
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Button onClick={addQuestion} variant="outlined" startIcon={<Add />} sx={{ borderColor: "4FD1C5", color: "#4FD1C5", marginBottom: 2 }}>
                                    Add Question
                                </Button>

                                <br />
                                <Button variant="contained" sx={{ bgcolor: "#4FD1C5" }} onClick={handleSaveTest}>
                                    Save Test
                                </Button>
                            </div>
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
                                        ) :
                                            // (
                                            //     test.idLesson.idLesson
                                            // )
                                            <></>
                                        }
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