import React from "react";
import { useNavigate } from "react-router-dom";

const SubmitTest = () => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        localStorage.removeItem("answers");
        alert("Your test has been submitted successfully!");
        navigate("/");
    };

    const handlePrevious = () => {
        navigate(-1);
    };

    return (
        <div className="h-screen flex items-start pt-[10vh] justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[400px] text-center">
                <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
                <p className="mb-6">Are you sure you want to submit the test?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handlePrevious}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-teal-400 text-white rounded hover:bg-teal-500"
                    >
                        Confirm Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitTest;
