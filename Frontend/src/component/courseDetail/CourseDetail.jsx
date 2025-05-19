import React, { useEffect, useState } from 'react';
import RatingReview from './rating/RatingReview.jsx';
import PaymentCard from './payment/PaymentCard.jsx';
import MarketingArticlesList from './marketingArticle/MarketingArticlesList.jsx';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [courseImage, setCourseImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setError('Invalid course ID');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Gọi đồng thời hai API
                const [historyResponse, courseResponse] = await Promise.all([
                    fetch(`http://localhost:5000/history/course/${courseId}`),
                    fetch(`http://localhost:5000/courses/${courseId}`)
                ]);

                const historyData = await historyResponse.json();
                const courseData = await courseResponse.json();

                // Lưu dữ liệu từ API history
                setCourseData({
                    ...historyData,
                    infor: historyData.infor || courseData.infor || "Unknown Course"
                });

                // Lưu URL ảnh từ API courses
                setCourseImage(courseData.image || "https://placehold.co/600x500");

                setLoading(false);
            } catch (err) {
                setError('Error fetching course data');
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    console.log("courseData: ", courseData);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <img
                src={courseImage || "https://placehold.co/600x500"}
                alt="Course"
                className="w-full rounded-md object-cover mb-4 h-[500px]"
                onError={(e) => e.target.src = "https://placehold.co/600x500"}
            />
            <div className="px-[5%] flex flex-col mb-10">
                <div className="text-2xl font-bold text-gray-700 pb-4 bt-2">
                    {courseData?.infor || "Unknown Course"}
                </div>
                <div className="items-start flex justify-between mb-10">
                    <RatingReview courseData={courseData} courseId={courseId} />
                    <PaymentCard courseData={{ ...courseData, image: courseImage }} />
                </div>
                <MarketingArticlesList />
            </div>
        </div>
    );
};

export default CourseDetail;