import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getTestDataById } from "../../redux/slices/testSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { singleTestData } = useSelector((state) => state.tests);
    const { testId } = useParams(); // phải trùng tên trong App.js hoặc nơi định nghĩa route - path="/test-page/:testId"
    // console.log("testId: ", testId);    // console.log("testData", singleTestData);
    
    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const user = localStorage.getItem("user");
        const saved = localStorage.getItem("answers");
        return user && saved ? JSON.parse(saved) : {};
    });
    
    useEffect(() => {
        const savedAnswers = localStorage.getItem("answers");
        if (savedAnswers) {
            // Parse saved answers and ensure they're in the right format
            const parsedAnswers = JSON.parse(savedAnswers);
            setSelectedAnswers(parsedAnswers);
        }

        dispatch(getTestDataById(testId));
    }, [dispatch, testId]);
    
    const handleAnswerSelect = (index, ans, optionIndex) => {
        // Store both the text and the index for clearer comparison
        setSelectedAnswers((prev) => ({ 
            ...prev, 
            [index]: ans,
            [`${index}_index`]: optionIndex
        }));
    };    const calculateScore = () => {
        let correct = 0;
        singleTestData.questions.forEach((q, index) => {
            // First check if we have a stored index (more reliable)
            const storedIndex = selectedAnswers[`${index}_index`];
            
            if (storedIndex !== undefined) {
                // Use the stored index directly
                if (Number(storedIndex) === q.correctAnswerIndex) {
                    correct += 1;
                }
            } else {
                // Fallback to comparing by text (for backwards compatibility)
                const selectedAnswer = selectedAnswers[index];
                if (selectedAnswer) {
                    const selectedIndex = q.options.findIndex(option => option === selectedAnswer);
                    if (selectedIndex === q.correctAnswerIndex) {
                        correct += 1;
                    }
                }        }
        });

        return correct; // Return number of correct answers
    };
    
    const handleSave = () => {
        // Ensure any last-minute selections are properly saved
        localStorage.setItem("answers", JSON.stringify(selectedAnswers));
        
        toast.success("Answers saved successfully! 📝", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        
        // Let the toast be visible before reload
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    // Chống gian lận
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount((prev) => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);    const studentId = localStorage.getItem("studentId");
    const courseId = localStorage.getItem("courseId");
    
    const handleSubmit = async () => {
        const confirmSubmit = window.confirm("📤 Are you sure you want to submit?");
        if (!confirmSubmit) return;
        
        // Validate studentId and testId
        if (!studentId) {
            toast.error("Student ID not found. Please log in again.");
            return;
        }
        
        if (!testId) {
            toast.error("Test ID not found. Please try again.");
            return;
        }
          const correct = calculateScore();
        const total = singleTestData.questions.length;
        const passed = correct >= Math.ceil(total * 0.5); // At least 50% correct
        const scorePercent = (correct / total) * 100;
        
        // Check for cheating (tab switching)
        const isCheating = tabSwitchCount >= 2;
        const finalScore = isCheating ? 0 : scorePercent;
        const finalPassed = isCheating ? false : passed;
        
        try {
            // The backend History schema requires score to be between 0-10
            // If you answered 5 correctly out of 5, your score should be 10
            const normalizedScore = isCheating ? 0 : ((correct / total) * 10);
            
            // Format to 2 decimal places
            const finalNormalizedScore = parseFloat(normalizedScore.toFixed(2));
            
            console.log("Submitting test result:", {
                studentId, 
                testId, 
                score: finalNormalizedScore,  // Normalized score on a 0-10 scale
                passed: finalPassed
            });
            
            // Submit to history with properly normalized score (0-10 scale)
            await axios.post("http://localhost:5000/history", { 
                studentId, 
                testId, 
                score: finalNormalizedScore, // Score on 0-10 scale as required by backend
                passed: finalPassed
            });            const resultMessage = `
                ✅ Correct: ${correct}/${total}
                🧮 Score: ${finalScore.toFixed(2)}% (${finalNormalizedScore}/10)
                🎓 Result: ${finalPassed ? "Pass" : "Fail"}
                ${isCheating ? "❌ Cheating detected: You switched tabs too many times!" : ""}
            `;

            alert(resultMessage);
            
            // Clear saved answers from localStorage
            localStorage.removeItem("answers");
            
            // Navigate back to course
            navigate(`/course/${courseId}`);
        } catch (error) {
            console.error("Error submitting test:", error);
            
            // Provide more detailed error feedback
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Response data:", error.response.data);
                console.error("Status code:", error.response.status);
                
                // Handle specific errors
                if (error.response.status === 400) {
                    if (error.response.data.error === 'Invalid ID format') {
                        toast.error("Invalid student or test ID format. Please log in again.");
                    } else if (error.response.data.error?.includes('Score')) {
                        toast.error("Invalid score format. Score must be between 0 and 10.");
                    } else {
                        toast.error(`Submission error: ${error.response.data.error || "Bad request"}`);
                    }
                } else {
                    toast.error(`Server error (${error.response.status}). Please try again.`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("No response from server. Please check your connection.");
            } else {
                // Something happened in setting up the request
                toast.error(`Error submitting test: ${error.message}`);
            }
        }
    };

    const questions = singleTestData?.questions || [];

    return (
        <div className="flex p-4 gap-4">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="colored"
            />
            {/* Sidebar */}
            <div className="w-1/5 border rounded-lg p-4 shadow">
                <h2 className="text-lg font-bold mb-4">Answers Status</h2>
                <ul className="space-y-4">
                    {questions.map((q, index) => {
                        const optionLabels = ["A", "B", "C", "D"];
                        return (
                            <li key={index} className="flex items-center space-x-3">
                                <span className="font-medium whitespace-nowrap">Question {index + 1}:</span>
                                <div className="flex items-center space-x-2">                                    {q.options.map((ans, idx) => (
                                        <label key={idx} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                name={`sidebar-question-${index}`}
                                                value={ans}
                                                checked={selectedAnswers[index] === ans || selectedAnswers[`${index}_index`] === idx}
                                                readOnly
                                            />
                                            <span>{optionLabels[idx]}</span>
                                        </label>
                                    ))}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Main Questions */}
            <div className="w-4/5 p-4 shadow space-y-6">
                {questions.map((q, index) => (
                    <div key={q._id} className="border-b pb-3">
                        <h3 className="font-semibold mb-2">Question {index + 1}: {q.question}</h3>
                        <div className="flex flex-col gap-2">
                            {q.options.map((ans, idx) => {
                                const optionLabels = ["A", "B", "C", "D"];
                                return (                                    <label key={idx} className="flex items-center space-x-2">                                            <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={ans}
                                            checked={selectedAnswers[index] === ans || selectedAnswers[`${index}_index`] === idx}
                                            onChange={() => handleAnswerSelect(index, ans, idx)}
                                        />
                                        <span>{`${optionLabels[idx]}. ${ans}`}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={handleSave} className="bg-teal-400 text-white px-6 py-2 rounded-xl shadow">
                        Save
                    </button>
                    <button onClick={handleSubmit} className="bg-teal-400 text-white px-6 py-2 rounded-xl shadow">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
