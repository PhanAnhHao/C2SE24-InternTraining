import React from "react";
import RatingReview from "./rating/RatingReview.jsx";
import PaymentCard from "./payment/PaymentCard.jsx";
import MarketingArticlesList from "./marketingArticle/MarketingArticlesList.jsx";

const CourseDetail = () => {
    return (
        <div>
            <img
                src={"/img/course.png"}
                alt="Course"
                className="w-full rounded-md object-cover mb-4 h-[500px] "
            />
            <div className=" px-[5%] flex flex-col mb-10">

                <div className="items-start flex justify-between mb-10">
                    <RatingReview />
                    <PaymentCard />
                </div>
                <MarketingArticlesList/>
            </div>
        </div>
    );
};

export default CourseDetail;
