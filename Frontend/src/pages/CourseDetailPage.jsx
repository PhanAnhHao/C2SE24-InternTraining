import React from "react";
import CourseDetail from "../component/courseDetail/CourseDetail.jsx";

const CourseDetailPage = () => {
    return (
        <div className="flex">
            <div className="flex-1 flex flex-col">
                <CourseDetail />
            </div>
        </div>
    );
};

export default CourseDetailPage;
