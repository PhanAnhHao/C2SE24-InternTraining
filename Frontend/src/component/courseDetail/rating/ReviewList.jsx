import React from 'react';
import ReviewItem from './ReviewItem.jsx';

const ReviewList = ({ ratingsData }) => {
    // Chuyển đổi dữ liệu từ API thành định dạng phù hợp cho ReviewItem
    const reviews = ratingsData.map((rating) => {
        // Chuyển đổi createdAt thành định dạng thời gian tương đối (ví dụ: "3 Months")
        const createdDate = new Date(rating.createdAt);
        const now = new Date();
        const monthsDiff = Math.round((now - createdDate) / (1000 * 60 * 60 * 24 * 30));
        const time = monthsDiff > 0 ? `${monthsDiff} Months` : 'Recently';

        return {
            name: rating.studentId?.userId?.userName || "Anonymous",
            rating: rating.stars,
            time: time,
            text: rating.feedback,
        };
    });

    return (
        <div>
            {reviews.map((review, index) => (
                <ReviewItem key={index} {...review} />
            ))}
        </div>
    );
};

export default ReviewList;