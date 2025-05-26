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

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setUserRatingLoading(true);
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                throw new Error('Không tìm thấy studentId trong localStorage. Vui lòng đăng nhập lại.');
            }
            console.log('Bắt đầu lấy dữ liệu - courseId:', courseId, 'studentId:', studentId);

            // Gọi cả hai API đồng thời
            const [ratingsResponse, userRatingResponse] = await Promise.all([
                fetch(`http://localhost:5000/courses/${courseId}`).then(res => {
                    if (!res.ok) throw new Error('Không thể lấy dữ liệu đánh giá khóa học');
                    return res.json();
                }),
                fetch(`http://localhost:5000/ratings?studentId=${studentId}`).then(res => {
                    if (!res.ok) throw new Error('Không thể lấy đánh giá của người dùng');
                    return res.json();
                }),
            ]);

            // Xử lý dữ liệu ratings
            const ratings = ratingsResponse.ratings || [];
            const sortedRatings = ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log('Tất cả đánh giá của khóa học (sắp xếp theo thời gian):', sortedRatings);
            setRatingsData(sortedRatings);

            // Xử lý userRating
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
                console.log('Danh sách đánh giá của người dùng:', userRatingResponse);
                console.log('Đánh giá của người dùng cho khóa học này:', userRatingForCourse);
                setUserRating(userRatingForCourse || null);
            } else {
                console.log('Không tìm thấy đánh giá nào cho studentId này');
                setUserRating(null);
            }

            setLoading(false);
            setUserRatingLoading(false);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu:', err.message);
            setError(err.message || 'Lỗi khi lấy dữ liệu đánh giá');
            setLoading(false);
            setUserRatingLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (!courseId) {
            setError('ID khóa học không hợp lệ');
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
            console.log('Đã cập nhật/thêm đánh giá mới:', updatedReview);

            // Tự động làm mới dữ liệu sau khi gửi/cập nhật đánh giá
            await fetchData();
        } catch (err) {
            console.error('Lỗi khi xử lý đánh giá:', err.message);
            setError('Lỗi khi gửi/cập nhật đánh giá');
        }
    };

    if (loading) return <div className="text-center text-gray-600">Đang tải dữ liệu...</div>;
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
                        <div className="text-center text-gray-600">Đang tải đánh giá của bạn...</div>
                    ) : userRating ? (
                        <ReviewSubmission
                            courseId={courseId}
                            onReviewSubmit={handleReviewSubmit}
                            existingRating={userRating}
                        />
                    ) : (
                        <div className="text-center text-gray-600">
                            Bạn chưa đánh giá khóa học này. Hãy gửi đánh giá của bạn!
                            <ReviewSubmission
                                courseId={courseId}
                                onReviewSubmit={handleReviewSubmit}
                                existingRating={userRating}
                            />
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