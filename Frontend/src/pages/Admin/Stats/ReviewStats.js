import axios from 'axios';

export const getReviewStats = async () => {
    try {
        const role = localStorage.getItem('role');
        // Đầu tiên lấy danh sách khóa học
        let coursesUrl = "http://localhost:5000/courses";
        if (role === "Business") {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) {
                return { total: 0 };
            }
            coursesUrl = `http://localhost:5000/courses/business/${businessId}`;
        }

        const coursesResponse = await axios.get(coursesUrl);
        let courses = role === "Business" ? coursesResponse.data.courses : coursesResponse.data;

        // Sau đó lấy đánh giá cho từng khóa học
        let totalRatings = 0;
        for (const course of courses) {
            try {
                const ratingResponse = await axios.get(`http://localhost:5000/ratings/course/${course._id}`);
                if (ratingResponse.data && Array.isArray(ratingResponse.data.ratings)) {
                    totalRatings += ratingResponse.data.ratings.length;
                }
            } catch (err) {
                console.error(`Error fetching ratings for course ${course._id}:`, err);
            }
        } return {
            total: totalRatings
        };
    } catch (error) {
        console.error("Error fetching review stats:", error);
        return { total: 0 };
    }
};
