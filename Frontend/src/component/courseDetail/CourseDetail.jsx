import React, { useEffect, useState } from 'react';
import RatingReview from './rating/RatingReview.jsx';
import PaymentCard from './payment/PaymentCard.jsx';
import MarketingArticlesList from './marketingArticle/MarketingArticlesList.jsx';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams(); // Sử dụng courseId thay vì idCourse
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setError('ID khóa học không hợp lệ');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/history/course/${courseId}`);
                const result = await response.json();
                setCourseData(result);
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu khóa học');
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    console.log("courseData: ", courseData)

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <img
                src="/img/course.png"
                alt="Course"
                className="w-full rounded-md object-cover mb-4 h-[500px]"
            />
            <div className="px-[5%] flex flex-col mb-10">
                <div className="text-2xl font-bold text-gray-700 pb-4 bt-2">{courseData?.courseName}</div>
                <div className="items-start flex justify-between mb-10">
                    <RatingReview courseData={courseData} courseId={courseId} />
                    <PaymentCard courseData={courseData} />
                </div>
                <MarketingArticlesList />
            </div>
        </div>
    );
};

export default CourseDetail;