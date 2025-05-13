import React, { useEffect, useState } from 'react';
import Rank from '../Rank/Rank.jsx';
import RatingSummary from './RatingSummary.jsx';
import ReviewList from './ReviewList.jsx';
import ReviewSubmission from './ReviewSubmission.jsx';

const RatingReview = ({ courseData, courseId }) => {
    const [selected, setSelected] = useState('rating');
    const [ratingsData, setRatingsData] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setError('ID khóa học không hợp lệ');
            setLoading(false);
            return;
        }

        const fetchRatings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/courses/${courseId}`);
                const result = await response.json();
                const ratings = result.ratings || [];
                console.log('All ratings for course:', ratings); // Debug tất cả đánh giá
                setRatingsData(ratings);
                setLoading(false);

                // Fallback: Tìm đánh giá của người dùng hiện tại từ ratingsData
                const studentId = localStorage.getItem('studentId');
                console.log('Current studentId:', studentId);
                console.log('Current courseId:', courseId);
                if (studentId && ratings.length > 0) {
                    const userRatingFromRatings = ratings.find(r =>
                        r.studentId && r.studentId._id && r.studentId._id.toString() === studentId.toString()
                    );
                    console.log('User rating from ratingsData:', userRatingFromRatings);
                    setUserRating(userRatingFromRatings || null);
                }
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu đánh giá');
                setLoading(false);
            }
        };

        const fetchUserRating = async () => {
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                try {
                    const response = await fetch(`http://localhost:5000/ratings?studentId=${studentId}`);
                    if (response.ok) {
                        const result = await response.json();
                        console.log('User rating result from API:', result);
                        if (result && result.length > 0) {
                            const userRatingForCourse = result.find(r =>
                                r.courseId && r.courseId._id && r.courseId._id.toString() === courseId.toString()
                            );
                            console.log('Filtered userRatingForCourse:', userRatingForCourse);
                            setUserRating(userRatingForCourse || null);
                        } else {
                            setUserRating(null);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching user rating:', err);
                    setUserRating(null);
                }
            }
        };

        fetchRatings();
        fetchUserRating();
    }, [courseId]);

    const handleReviewSubmit = (updatedReview) => {
        if (userRating && userRating._id === updatedReview._id) {
            // Cập nhật đánh giá hiện có trong danh sách
            setRatingsData(ratingsData.map((rating) =>
                rating._id === updatedReview._id ? updatedReview : rating
            ));
        } else {
            // Thêm đánh giá mới vào danh sách
            setRatingsData([...ratingsData, updatedReview]);
        }
        setUserRating(updatedReview);
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-3/5">
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        selected === 'rating'
                            ? 'bg-[#49BBBD] text-white'
                            : 'bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => setSelected('rating')}
                >
                    Rating
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        selected === 'rank'
                            ? 'bg-[#49BBBD] text-white'
                            : 'bg-gray-200 text-gray-600'
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
                    <ReviewSubmission
                        courseId={courseId}
                        onReviewSubmit={handleReviewSubmit}
                        existingRating={userRating}
                    />
                </div>
            ) : (
                <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md h-auto">
                    <Rank courseId={courseId} />
                </div>
            )}
        </div>
    );
};

export default RatingReview;