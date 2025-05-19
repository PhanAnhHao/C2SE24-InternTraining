import React, { useState } from 'react';
import ReviewItem from './ReviewItem.jsx';

const ReviewList = ({ ratingsData }) => {
    const [displayLimit, setDisplayLimit] = useState(4); // Start with 4 reviews

    // Convert API data to the format required by ReviewItem
    const reviews = ratingsData.map((rating) => {
        // Convert createdAt to relative time (e.g., "3 Months")
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

    // Slice reviews to show only up to the current display limit
    const displayedReviews = reviews.slice(0, displayLimit);

    // Handler for "View More" button
    const handleViewMore = () => {
        setDisplayLimit((prevLimit) => prevLimit + 4); // Show 4 more reviews
    };

    return (
        <div>
            {displayedReviews.map((review, index) => (
                <ReviewItem key={index} {...review} />
            ))}
            {displayLimit < reviews.length && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleViewMore}
                        className="text-teal-500 font-semibold hover:underline"
                    >
                        View More
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;