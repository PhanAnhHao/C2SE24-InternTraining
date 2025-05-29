import List from "../../common/List.jsx";
import CourseCard from "../../common/CourseCard.jsx";

const courses = [
    {
        id: 1,
        title: "Certified Solutions Architect",
        category: "design",
        duration: "3 month",
        instructor: "Lina",
        image: "/img/image1.jpg",
        description:
            "Learn to design and deploy scalable systems on AWS. Ideal for aspiring cloud architects and IT professionals.",
        price: 400,
        oldPrice: 500
    },
    {
        id: 2,
        title: "React Native for Beginners",
        category: "design",
        duration: "3 month",
        instructor: "Alex",
        image: "/img/image2.jpg",
        description:
            "Start building mobile apps using React Native. No prior mobile development experience needed.",
        price: 400,
        oldPrice: 500
    },
    {
        id: 3,
        title: "Mastering Tailwind CSS",
        category: "design",
        duration: "3 month",
        instructor: "John",
        image: "/img/image3.jpg",
        description:
            "A practical course to build modern, responsive UIs using utility-first Tailwind CSS framework.",
        price: 400,
        oldPrice: 500
    },
    {
        id: 4,
        title: "Fullstack Web Development",
        category: "design",
        duration: "3 month",
        instructor: "Emma",
        image: "/img/image4.jpg",
        description:
            "Master both frontend and backend technologies to build complete web applications from scratch.",
        price: 400,
        oldPrice: 500
    },
    {
        id: 5,
        title: "Cyber Security Basics",
        category: "design",
        duration: "3 month",
        instructor: "David",
        image: "/img/image5.jpg",
        description:
            "Understand the fundamentals of cybersecurity, including network security, threats, and safe practices.",
        price: 400,
        oldPrice: 500
    }
];


const FeaturedList = () => {
    return (
        <List
            title="Get choice of your course"
            seeAllLink="#"
            items={courses}
            itemsPerPage={4}
            bg="#DEEDFD"
            renderItem={(course) => <CourseCard course={course} />}
        />
    );
};

export default FeaturedList;
