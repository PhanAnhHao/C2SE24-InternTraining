import React, { useEffect, useState } from 'react';
import Rank from '../Rank/Rank.jsx';
import RatingSummary from './RatingSummary.jsx';
import ReviewList from './ReviewList.jsx';

const RatingReview = ({ courseData, courseId }) => {
    const [selected, setSelected] = useState('rating');
    const [ratingsData, setRatingsData] = useState([]);
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
                setRatingsData(result.ratings || []);
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu đánh giá');
                setLoading(false);
            }
        };
        fetchRatings();
    }, [courseId]);

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