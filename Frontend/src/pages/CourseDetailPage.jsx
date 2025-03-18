import React from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import CourseDetail from "../component/courseDetail/CourseDetail.jsx";

const CourseDetailPage = () => {
    return (
        <div className="flex pt-16">
            <div className="flex-1 flex flex-col">
                <Header />
                <CourseDetail />
                <Footer />
            </div>
        </div>
    );
};

export default CourseDetailPage;
