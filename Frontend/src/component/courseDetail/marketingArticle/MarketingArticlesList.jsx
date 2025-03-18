
import CourseCard from "../../common/CourseCard.jsx";
import List from "../../common/List.jsx";
const courses = [
    { id: 1, title: "Certified Solutions Architect", category:"design", duration:"3 month", instructor: "Lina", image: "/img/aws1.jpg", description:"Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor", price: 400, oldPrice: 500 },
    { id: 2, title: "React Native for Beginners", category:"design", duration:"3 month", instructor: "Alex", image: "/img/react-native.jpg", description:"Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor", price: 400, oldPrice: 500 },
    { id: 3, title: "Mastering Tailwind CSS", category:"design", duration:"3 month", instructor: "John", image: "/img/tailwind.jpg", description:"Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor", price: 400, oldPrice: 500 },
    { id: 4, title: "Fullstack Web Development", category:"design", duration:"3 month", instructor: "Emma", image: "/img/fullstack.jpg", description:"Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor", price: 400, oldPrice: 500 },
    { id: 5, title: "Cyber Security Basics", category:"design", duration:"3 month", instructor: "David", image: "/img/cyber.jpg", description:"Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor", price: 400, oldPrice: 500 }
];

const MarketingArticlesList = () => {


    return (
        <List
            title="Marketing Articles"
            seeAllLink="#"
            items={courses}
            itemsPerPage={4}
            bg="#DEEDFD"
            renderItem={(course) => <CourseCard course={course} />}
        />
    );

};

export default MarketingArticlesList;