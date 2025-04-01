import { useState } from "react";
import ActiveCourseCard from "./ActiveCourseCard.jsx";
import CarouselControls from "../../common/CarouselControls.jsx";

const courses = [
    { id: 1, title: "AWS Certified Solutions Architect", instructor: "Lina", image: "/img/aws1.jpg" },
    { id: 2, title: "React Native for Beginners", instructor: "Alex", image: "/img/react-native.jpg" },
    { id: 3, title: "Mastering Tailwind CSS", instructor: "John", image: "/img/tailwind.jpg" },
    { id: 4, title: "Fullstack Web Development", instructor: "Emma", image: "/img/fullstack.jpg" },
    { id: 5, title: "Cyber Security Basics", instructor: "David", image: "/img/cyber.jpg" }
];

const ActiveCourseList = () => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCourses = courses.slice(startIndex, startIndex + 3);


    return (
        <div className="bg-[#DEEDFD] py-10  rounded-xl  ">
            <div className="px-[5%]">

            {/* Tiêu đề */}
            <div className="flex justify-between items-center  mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Welcome back, ready for your next lesson?
                </h2>
                <a href="#" className="text-[#49BBBD] text-lg font-bold">View history</a>
            </div>

            {/* Danh sách khóa học */}
            <div className="relative flex flex-col items-center">
                <div className="flex w-full justify-between ">
                    {visibleCourses.map(course => (
                        <ActiveCourseCard key={course.id} course={course} />
                    ))}
                </div>

                {/* Nút chuyển trang */}
                <CarouselControls
                    onPrev={() => setStartIndex(prev => Math.max(prev - 1, 0))}
                    onNext={() => setStartIndex(prev => Math.min(prev + 1, courses.length - 3))}
                    isPrevDisabled={startIndex === 0}
                    isNextDisabled={startIndex + 3 >= courses.length}
                />
            </div>
            </div>
        </div>
    );
};

export default ActiveCourseList;
