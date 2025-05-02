import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getTestDataById } from "../../redux/slices/testSlice";

const TestPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { testData, loading, error } = useSelector((state) => state.tests);

    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const user = localStorage.getItem("user");
        const saved = localStorage.getItem("answers");
        return user && saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        const savedAnswers = localStorage.getItem("answers");
        if (savedAnswers) {
            setSelectedAnswers(JSON.parse(savedAnswers));
        }

        dispatch(getTestDataById("68138d9090d5d96e92da8382"));
    }, [dispatch]);

    const handleAnswerSelect = (index, ans) => {
        setSelectedAnswers((prev) => ({ ...prev, [index]: ans }));
    };

    const handleSave = () => {
        localStorage.setItem("answers", JSON.stringify(selectedAnswers));
        alert("Answers saved!");
        window.location.reload();
    };

    const handleSubmit = () => {
        navigate("/submit-test");
    };

    const questions = testData?.questions || [];

    return (
        <div className="flex p-4 gap-4">
            {/* Sidebar */}
            <div className="w-1/5 border rounded-lg p-4 shadow">
                <h2 className="text-lg font-bold mb-4">Answers Status</h2>
                <ul className="space-y-4">
                    {questions.map((q, index) => {
                        const optionLabels = ["A", "B", "C", "D"];
                        return (
                            <li key={index} className="flex items-center space-x-3">
                                <span className="font-medium whitespace-nowrap">Question {index + 1}:</span>
                                <div className="flex items-center space-x-2">
                                    {q.options.map((ans, idx) => (
                                        <label key={idx} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                name={`sidebar-question-${index}`}
                                                value={ans}
                                                checked={selectedAnswers[index] === ans}
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
                                return (
                                    <label key={idx} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={ans}
                                            checked={selectedAnswers[index] === ans}
                                            onChange={() => handleAnswerSelect(index, ans)}
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
