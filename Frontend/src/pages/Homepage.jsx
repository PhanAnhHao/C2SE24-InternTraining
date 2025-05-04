import React from 'react'
import HeroContent from '../component/HomePage/HeroContent';
import OurSuccess from '../component/HomePage/OurSuccess';
import WhatIs from '../component/HomePage/WhatIs';
import CategoryList from '../component/courses/category/CategoryList';
import RecommendList from '../component/courses/recommendCourses/RecommendList';
import Testimonial from '../component/HomePage/Testimonial';
import OurFeatures from '../component/HomePage/OurFeatures';

const Homepage = () => {
    return (
        <div>
            <HeroContent />
            <OurSuccess />
            <hr className='mx-[100px] text-gray-300 mb-10 mt-[-80px]' />
            <WhatIs />
            <hr className='mx-[100px] text-gray-300 my-10' />
            <OurFeatures />
            <hr className='mx-[100px] text-gray-300 my-10' />
            <CategoryList />
            {/*<RecommendList />*/}
            <Testimonial />
        </div>
    )
}

export default Homepage;
