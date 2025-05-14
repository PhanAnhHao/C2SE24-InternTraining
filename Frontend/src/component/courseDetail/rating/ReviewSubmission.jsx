import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

const ReviewSubmission = ({ courseId, onReviewSubmit, existingRating }) => {
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    // Pre-fill form if there is an existing rating
    useEffect(() => {
        if (existingRating) {
            setUserRating(existingRating.stars || 0);
            setUserReview(existingRating.feedback || '');
        }
    }, [existingRating]);

    const handleStarClick = (rating) => {
        setUserRating(rating);
    };

    const handleSubmitReview = async () => {
        if (userRating === 0 || !userReview.trim()) {
            enqueueSnackbar('Please select stars and enter review!', { variant: 'warning' });
            return;
        }

        // Retrieve studentId and role from local storage
        const studentId = localStorage.getItem('studentId');
        const role = localStorage.getItem('role');

        // Check if user is logged in
        if (!studentId || !role) {
            const confirmLogin = window.confirm('You must log in before rating!\n\nClick "Login" to log in, or "Cancel" to exit.');
            if (confirmLogin) {
                window.location.href = '/login';
            }
            return;
        }

        // Check if role is Business
        if (role === 'Business') {
            enqueueSnackbar('You cannot rate with the Business role!', { variant: 'warning' });
            return;
        }

        const reviewData = {
            stars: userRating,
            feedback: userReview,
        };

        try {
            let response;
            if (existingRating) {
                // Update existing rating
                response = await fetch(`http://localhost:5000/ratings/${existingRating._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData),
                    credentials: 'include',
                });
            } else {
                // Create new rating
                reviewData.studentId = studentId;
                reviewData.courseId = courseId;
                response = await fetch('http://localhost:5000/ratings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData),
                    credentials: 'include',
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            onReviewSubmit(result);
            setUserRating(existingRating ? userRating : 0); // Reset only if creating new
            setUserReview(existingRating ? userReview : ''); // Reset only if creating new
            enqueueSnackbar(
                existingRating ? 'Your review has been updated!' : 'Your review has been submitted!',
                { variant: 'success' }
            );
        } catch (err) {
            enqueueSnackbar(`Lỗi: ${err.message}`, { variant: 'error' });
            console.error('Fetch error:', err);
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Submit your review</h3>
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-8 h-8 cursor-pointer ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        onClick={() => handleStarClick(star)}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <textarea
                className="w-full p-3 border rounded-lg bg-white mb-4"
                rows="4"
                placeholder="Enter your review..."
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
            />
            <div className="flex justify-end">
                <button
                    className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg"
                    onClick={handleSubmitReview}
                >
                    {existingRating ? 'Update review' : 'Submit review'}
                </button>
            </div>
        </div>
    );
};

export default ReviewSubmission;