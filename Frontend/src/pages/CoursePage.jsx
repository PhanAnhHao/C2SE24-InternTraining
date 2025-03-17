import React from 'react';
import Header from '../layout/Header.jsx';
import Footer from "../layout/Footer.jsx";
import ActiveCourseList from '../components/courses/activeCourses/ActiveCourseList.jsx';
import CategoryList from "../components/courses/category/CategoryList.jsx";
import RecommendList from "../components/courses/recommendCourses/RecommendList.jsx";
import FeaturedList from "../components/courses/FeaturedCourses/FeaturedList.jsx";
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
