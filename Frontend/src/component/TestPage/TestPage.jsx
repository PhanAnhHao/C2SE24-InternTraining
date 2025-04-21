import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const mockQuestions = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1}: What is the correct answer?`,
    answers: [
        `Answer A for Q${i + 1}`,
        `Answer B for Q${i + 1}`,
        `Answer C for Q${i + 1}`,
        `Answer D for Q${i + 1}`,
    ],
}));

const TestPage = () => {
    const navigate = useNavigate();
    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const saved = localStorage.getItem("answers");
        return saved ? JSON.parse(saved) : {};
    });

    const handleAnswerSelect = (qId, ans) => {
        setSelectedAnswers((prev) => {
            const updated = { ...prev, [qId]: ans };
            localStorage.setItem("answers", JSON.stringify(updated));
            return updated;
        });
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
            <div className="w-1/5 border rounded-lg p-4 shadow">
                <h2 className="text-lg font-bold mb-4">Answers Status</h2>
                <ul className="space-y-1">
                    {mockQuestions.map((q) => (
                        <li key={q.id}>
                            Question {q.id}:{" "}
                            <span className={selectedAnswers[q.id] ? "text-green-600" : "text-red-500"}>
                                {selectedAnswers[q.id] ? "Selected" : "Not answered"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Column */}
            <div className="w-4/5 overflow-y-auto h-[80vh] border rounded-lg p-4 shadow space-y-6">
                {mockQuestions.map((q) => (
                    <div key={q.id} className="border-b pb-3">
                        <h3 className="font-semibold mb-2">{q.question}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {q.answers.map((ans, idx) => (
                                <label key={idx} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={ans}
                                        checked={selectedAnswers[q.id] === ans}
                                        onChange={() => handleAnswerSelect(q.id, ans)}
                                    />
                                    <span>{ans}</span>
                                </label>
                            ))}
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
