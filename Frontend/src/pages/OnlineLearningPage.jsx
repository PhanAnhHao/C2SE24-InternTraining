import { useState, useEffect } from "react";
import VideoSection from '../component/OnlineLearning/VideoSection.jsx';
import CourseContentList from "../component/OnlineLearning/CourseContentList.jsx";
import Header from "../component/OnlineLearning/Header.jsx";

// Import mockData from CourseContentList
import { mockData } from "../component/OnlineLearning/CourseContentList.jsx";

const OnlineLearningPage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        if (mockData && mockData.length > 0) {
            setSelectedLesson(mockData[0]);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                {selectedLesson ? (
                    <VideoSection selectedLesson={selectedLesson} />
                ) : (
                    <div>Loading...</div>
                )}
                <CourseContentList setSelectedLesson={setSelectedLesson} />
            </div>
        </div>
    );
};


export default OnlineLearningPage;