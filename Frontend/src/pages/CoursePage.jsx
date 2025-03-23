import React from 'react';
import ActiveCourseList from '../component/courses/activeCourses/ActiveCourseList.jsx';
import CategoryList from "../component/courses/category/CategoryList.jsx";
import RecommendList from "../component/courses/recommendCourses/RecommendList.jsx";
import FeaturedList from "../component/courses/FeaturedCourses/FeaturedList.jsx";
const CoursePage = () => {
    return (
        <div className="flex">
            <div className="flex-1 flex flex-col">
                < ActiveCourseList />
                <CategoryList />
                <RecommendList />
                <FeaturedList />
            </div>
        </div>
    );
};

export default CoursePage;
