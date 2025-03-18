import React from 'react';
import Header from '../layout/Header.jsx';
import Footer from "../layout/Footer.jsx";
import ActiveCourseList from '../component/courses/activeCourses/ActiveCourseList.jsx';
import CategoryList from "../component/courses/category/CategoryList.jsx";
import RecommendList from "../component/courses/recommendCourses/RecommendList.jsx";
import FeaturedList from "../component/courses/FeaturedCourses/FeaturedList.jsx";
const CoursePage = () => {
    return (
        <div className="flex pt-16">

            <div className="flex-1 flex flex-col">
                <Header />
                < ActiveCourseList/>
                <CategoryList />
                <RecommendList />
                <FeaturedList />
                <Footer />
            </div>
        </div>
    );
};

export default CoursePage ;
