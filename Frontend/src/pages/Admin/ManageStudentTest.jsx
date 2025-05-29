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
import { createTest, deleteTest, getAllTests, updateTest } from '../../redux/slices/testSlice';
import { getAllCourses } from '../../redux/slices/courseSlice';
import { toast } from "react-toastify";

const ManageStudentTest = () => {
    // const [tests, setTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [lessons, setLessons] = useState([]);
    // const [questions, setQuestions] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        idTest: '',
        idCourse: '',
        content: '',
        idQuestion: []
    });

    // const testsPerPage = 10;
    // const totalPages = Math.ceil(tests.length / testsPerPage);

    // const indexOfLastTest = currentPage * testsPerPage;
    // const indexOfFirstTest = indexOfLastTest - testsPerPage;
    // const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

    useEffect(() => {
        fetchTests();
        fetchLessons();
        // fetchQuestions();
    }, []);
    const fetchTests = async () => {
        // try {
        //     const response = await axios.get("http://localhost:5000/tests");
        //     setTests(response.data);
        // } catch (error) {
        //     enqueueSnackbar("Failed to fetch tests", { variant: "error" });
        //     console.error("Error fetching tests:", error);
        // }
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
        // if (window.confirm("Are you sure you want to delete this test?")) {
        //     try {
        //         await axios.delete(`http://localhost:5000/tests/${id}`);
        //         setTests(tests.filter(test => test._id !== id));
        //         enqueueSnackbar("Test deleted successfully", { variant: "success" });
        //     } catch (error) {
        //         enqueueSnackbar("Failed to delete test", { variant: "error" });
        //         console.error("Error deleting test:", error);
        //     }
        // }
    };

    const handleEditClick = (test) => {
        // setEditingId(test._id);
        // setEditForm({
        //     idTest: test.idTest,
        //     idLesson: test.idLesson._id,
        //     content: test.content,
        //     idQuestion: test.idQuestion.map(q => q._id)
        // });
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

    const emitTestsUpdated = () => {
        const event = new CustomEvent('testsUpdated');
        window.dispatchEvent(event);
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
            emitTestsUpdated(); // Emit event khi thêm test
        } catch (error) {
            enqueueSnackbar("Failed to add test", { variant: "error" });
            console.error("Error adding test:", error);
        }
    };


    // Add/remove question
    const dispatch = useDispatch();
    const { tests, testLoading, testError } = useSelector((state) => state.tests);
    const { courses, courseLoading, courseError } = useSelector((state) => state.courses);
    const [isEditMode, setIsEditMode] = useState(false);
    const [idDBTest, setIdDBTest] = useState("");
    const [questions, setQuestions] = useState([{
        idTest: "", // sẽ gán khi submit
        question: "",
        options: [""],
        correctAnswerIndex: 0,
    },]);

    const testsPerPage = 10;
    const totalPages = Math.ceil(tests.length / testsPerPage);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

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
        // Tạo một bản sao của mảng questions
        const updated = [...questions];

        // Xóa câu hỏi tại vị trí qIndex
        updated.splice(qIndex, 1);

        // Cập nhật lại state
        setQuestions(updated);
    };


    const handleQuestionChange = (qIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].question = value;  // Cập nhật câu hỏi
        setQuestions(updatedQuestions);  // Cập nhật lại state
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updatedQuestions = [...questions];
        const updatedOptions = [...updatedQuestions[qIndex].options];  // Tạo bản sao options
        updatedOptions[aIndex] = value;
        updatedQuestions[qIndex] = {
            ...updatedQuestions[qIndex],
            options: updatedOptions,  // Gán options mới vào câu hỏi
        };
        setQuestions(updatedQuestions);
    };


    const addAnswer = (qIndex) => {
        // Tạo một bản sao của mảng questions
        const updated = [...questions];

        // Thêm một đáp án rỗng vào câu hỏi
        updated[qIndex].options = [...updated[qIndex].options, ""];

        // Cập nhật state
        setQuestions(updated);
    };


    const removeAnswer = (qIndex, aIndex) => {
        // Tạo một bản sao của mảng questions
        const updated = [...questions];

        // Tạo bản sao của mảng options trong câu hỏi hiện tại
        updated[qIndex].options = updated[qIndex].options.filter((_, index) => index !== aIndex);

        // Nếu đáp án đúng là đáp án bị xóa, phải cập nhật lại correctAnswerIndex
        if (updated[qIndex].correctAnswerIndex === aIndex) {
            updated[qIndex].correctAnswerIndex = 0;  // Đặt lại đáp án đúng về 0
        } else if (updated[qIndex].correctAnswerIndex > aIndex) {
            updated[qIndex].correctAnswerIndex -= 1;  // Giảm index của đáp án đúng
        }

        // Cập nhật lại state
        setQuestions(updated);
    };


    const handleCorrectChange = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].correctAnswerIndex = aIndex;  // Cập nhật đáp án đúng
        setQuestions(updatedQuestions);  // Cập nhật lại state
    };

    const handleEditTest = (test) => {
        setForm({
            idTest: test.idTest,
            idCourse: test.idCourse || test?.course?._id,  // Sử dụng _id của course nếu có
            content: test.content,
        });

        // Map lại câu hỏi (questions) theo đúng format
        const mappedQuestions = test.questions.map((q) => ({
            idQuestion: q.idQuestion || "",
            idTest: test.idTest,
            question: q.question || "",
            options: q.options || [""],  // Nếu không có options, tạo một array trống
            correctAnswerIndex: q.correctAnswerIndex || 0,  // Nếu không có chỉ định đúng, mặc định là 0
        }));

        setQuestions(mappedQuestions);  // Set câu hỏi đã được map
        setIsEditMode(true);            // Đặt chế độ là Edit
        setShowForm(true);              // Hiển thị form
        setIdDBTest(test.id);           // Lưu lại id của bài test để update
    };


    const handleSaveTest = async () => {
        const testId = form.idTest;
        const idCourse = form.idCourse;

        // Kiểm tra thông tin đầu vào
        if (!testId || !form.content || !idCourse) {
            alert("Vui lòng điền đầy đủ thông tin Test ID, nội dung bài test, và khóa học.");
            return;
        }

        // Xử lý các câu hỏi
        const finalQuestions = questions.map((q, index) => ({
            idQuestion: q.idQuestion || `Q_${testId}_${index + 1}`, // Tạo id cho câu hỏi nếu chưa có
            idTest: testId,
            question: q.question,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
        }));

        const testPayload = {
            idTest: testId,
            idCourse: idCourse,
            content: form.content,
            questions: finalQuestions,
        };

        console.log("Payload to submit:", testPayload);

        try {
            if (isEditMode) {
                // Cập nhật bài kiểm tra
                const resultAction = await dispatch(updateTest({ id: idDBTest, data: testPayload }));

                if (updateTest.fulfilled.match(resultAction)) {
                    toast.success("Cập nhật bài kiểm tra thành công!");
                    dispatch(getAllTests());  // Lấy lại danh sách bài kiểm tra
                    setShowForm(false);
                    emitTestsUpdated(); // Emit event khi cập nhật test
                } else {
                    toast.error(resultAction.payload || "Cập nhật thất bại!");
                }
            } else {
                // Tạo bài kiểm tra mới
                const resultAction = await dispatch(createTest(testPayload));

                if (createTest.fulfilled.match(resultAction)) {
                    toast.success("Tạo bài kiểm tra thành công!");
                    dispatch(getAllTests());  // Lấy lại danh sách bài kiểm tra mới
                    setShowForm(false);
                    emitTestsUpdated(); // Emit event khi tạo test mới
                } else {
                    toast.error(resultAction.payload || "Tạo thất bại!");
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            console.error("Error during save test:", error);
        }
    };


    useEffect(() => {
        dispatch(getAllCourses());
        dispatch(getAllTests());
    }, []);

    const handleDeleteTest = async (id) => {
        await dispatch(deleteTest(id));
        dispatch(getAllTests());
    }

    return (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                    <FaClipboardList className="text-[#4FD1C5] mr-2" /> Manage Student Tests
                </h1>

                <div className="flex justify-end mb-4 mt-4">
                    <button
                        onClick={() => {
                            setForm({ idTest: '', idCourse: '', content: '' });
                            setQuestions([{ idTest: '', question: '', options: [''], correctAnswerIndex: 0 }]);
                            setIsEditMode(false);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 bg-[#4FD1C5] text-white rounded hover:bg-teal-500 transition"
                    >
                        + Add New Test
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditMode ? 'Edit Test' : 'Add New Test'}
                        </h2>
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
                                    disabled={isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <select
                                    name="idCourse"
                                    value={form.idCourse}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.idCourse} - {course.infor}
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
                                <th className="py-3 px-4 text-left">Course ID</th>
                                <th className="py-3 px-4 text-left">Content</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testLoading === true ? <>Loading...</> : currentTests.map((test, index) => (
                                <tr key={test.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="py-3 px-4">{test.idTest}</td>
                                    <td className="py-3 px-4">
                                        {test?.course?.idCourse}
                                    </td>
                                    <td className="py-3 px-4">
                                        {test.content}
                                    </td>
                                    <td className="py-3 px-4 space-x-2">
                                        <>
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleEditTest(test)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteTest(test.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
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
        </div >
    );
};

export default ManageStudentTest;