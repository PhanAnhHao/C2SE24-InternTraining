import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const user = localStorage.getItem("user");
        const saved = localStorage.getItem("answers");
        return user && saved ? JSON.parse(saved) : {};
    });

    // Fake answers generator
    const addFakeAnswers = (rawQuestions) => {
        return rawQuestions.map((q) => ({
            ...q,
            answers: [
                { text: "Answer A" },
                { text: "Answer B" },
                { text: "Answer C" },
                { text: "Answer D" },
            ],
        }));
    };

    // useEffect(() => {
    //     axios.get("http://localhost:5000/questions")
    //         .then((response) => {
    //             const questionsWithAnswers = addFakeAnswers(response.data);
    //             setQuestions(questionsWithAnswers);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching questions:", error);
    //         });
    // }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/questions")
            .then((response) => {
                const questionsWithAnswers = response.data.map((q) => ({
                    question: q.question,
                    answers: q.options.map((opt) => ({ text: opt }))
                }));
                setQuestions(questionsWithAnswers);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });
    }, []);

    const handleAnswerSelect = (index, ans) => {
        setSelectedAnswers((prev) => ({ ...prev, [index]: ans }));
    };

    const handleSave = () => {
        localStorage.setItem("answers", JSON.stringify(selectedAnswers));
        alert("Answers saved!");
    };

    const handleSubmit = () => {
        navigate("/submit-test");
    };

    return (
        <div className="flex p-4 gap-4">
            {/* Left Column */}
            {/* Left Column */}
            <div className="w-1/5 border rounded-lg p-4 shadow">
                <h2 className="text-lg font-bold mb-4">Answers Status</h2>
                <ul className="space-y-4">
                    {questions.map((q, index) => {
                        const optionLabels = ["A", "B", "C", "D"];
                        return (
                            <li key={index} className="flex items-center space-x-3">
                                <span className="font-medium whitespace-nowrap">Question {index + 1}:</span>
                                <div className="flex items-center space-x-2">
                                    {q.answers.map((ans, idx) => (
                                        <label key={idx} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                name={`sidebar-question-${index}`}
                                                value={ans.text}
                                                checked={selectedAnswers[index] === ans.text}
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




            {/* Right Column */}
            <div className="w-4/5 p-4 shadow space-y-6">
                {questions.map((q, index) => (
                    <div key={index} className="border-b pb-3">
                        <h3 className="font-semibold mb-2">Question {index + 1}: {q.question}</h3>
                        <div className="flex flex-col gap-2">
                            {q.answers.map((ans, idx) => {
                                const optionLabels = ["A", "B", "C", "D"];
                                return (
                                    <label key={idx} className="flex items-center space-x-2 break-words w-full">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={ans.text}
                                            checked={selectedAnswers[index] === ans.text}
                                            onChange={() => handleAnswerSelect(index, ans.text)}
                                        />
                                        <span>{`${optionLabels[idx]}. ${ans.text}`}</span>
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
