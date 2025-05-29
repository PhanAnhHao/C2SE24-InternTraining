import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Rank from '../Rank/Rank.jsx';
import RatingSummary from './RatingSummary.jsx';
import ReviewList from './ReviewList.jsx';
import ReviewSubmission from './ReviewSubmission.jsx';

const RatingReview = ({ courseData, courseId }) => {
    const [selected, setSelected] = useState('rating');
    const [ratingsData, setRatingsData] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRatingLoading, setUserRatingLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setUserRatingLoading(true);
            const studentId = localStorage.getItem('studentId');
            setIsLoggedIn(!!studentId); // Check login status

            // Fetch course ratings
            const ratingsResponse = await fetch(`http://localhost:5000/courses/${courseId}`).then(res => {
                if (!res.ok) throw new Error('Unable to fetch course ratings data');
                return res.json();
            });

            // Process ratings data
            const ratings = ratingsResponse.ratings || [];
            const sortedRatings = ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log('All course ratings (sorted by time):', sortedRatings);
            setRatingsData(sortedRatings);

            // Process user rating if logged in
            if (studentId) {
                const userRatingResponse = await fetch(`http://localhost:5000/ratings?studentId=${studentId}`).then(res => {
                    if (!res.ok) throw new Error('Unable to fetch user ratings');
                    return res.json();
                });

                if (userRatingResponse.length > 0) {
                    const userRatingForCourse = userRatingResponse.find(
                        (r) =>
                            r.studentId &&
                            r.studentId._id &&
                            r.studentId._id.toString() === studentId.toString() &&
                            r.courseId &&
                            r.courseId._id &&
                            r.courseId._id.toString() === courseId.toString()
                    );
                    console.log('List of user ratings:', userRatingResponse);
                    console.log('User rating for this course:', userRatingForCourse);
                    setUserRating(userRatingForCourse || null);
                } else {
                    console.log('No ratings found for this studentId');
                    setUserRating(null);
                }
            } else {
                setUserRating(null); // No studentId, set userRating to null
            }

            setLoading(false);
            setUserRatingLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err.message);
            setError(err.message || 'Error fetching ratings data');
            setLoading(false);
            setUserRatingLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (!courseId) {
            setError('Invalid course ID');
            setLoading(false);
            setUserRatingLoading(false);
            return;
        }

        fetchData();
    }, [courseId, fetchData]);

    const handleReviewSubmit = async (updatedReview) => {
        try {
            const updatedRatingsData = userRating && userRating._id === updatedReview._id
                ? ratingsData.map((rating) =>
                    rating._id === updatedReview._id ? updatedReview : rating
                )
                : [...ratingsData, updatedReview];

            setRatingsData(updatedRatingsData);
            setUserRating(updatedReview);
            console.log('Updated/added new rating:', updatedReview);

            // Refresh data after submitting/updating a review
            await fetchData();
        } catch (err) {
            console.error('Error processing review:', err.message);
            setError('Error submitting/updating review');
        }
    };

    if (loading) return <div className="text-center text-gray-600">Loading data...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="w-3/5">
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        selected === 'rating'
                            ? 'bg-[#49BBBD] text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => setSelected('rating')}
                >
                    Rating
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        selected === 'rank'
                            ? 'bg-[#49BBBD] text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => setSelected('rank')}
                >
                    Rank
                </button>
            </div>
            {selected === 'rating' ? (
                <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md h-auto">
                    <RatingSummary ratingsData={ratingsData} />
                    <ReviewList ratingsData={ratingsData} />
                    {userRatingLoading ? (
                        <div className="text-center text-gray-600">Loading your review...</div>
                    ) : isLoggedIn ? (
                        userRating ? (
                            <ReviewSubmission
                                courseId={courseId}
                                onReviewSubmit={handleReviewSubmit}
                                existingRating={userRating}
                            />
                        ) : (
                            <div className="text-center text-gray-600">
                                You haven't reviewed this course yet. Submit your review now!
                                <ReviewSubmission
                                    courseId={courseId}
                                    onReviewSubmit={handleReviewSubmit}
                                    existingRating={userRating}
                                />
                            </div>
                        )
                    ) : (
                        <div className="text-center text-gray-600">
                            Please log in to submit a course review.
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md h-auto">
                    <Rank courseId={courseId} />
                </div>
            )}
        </div>
    );
};

RatingReview.propTypes = {
    courseData: PropTypes.object,
    courseId: PropTypes.string.isRequired,
};

export default React.memo(RatingReview);