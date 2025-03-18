import { faPaintBrush, faLaptopCode, faBriefcase, faBullhorn, faCamera, faTheaterMasks, faBook } from "@fortawesome/free-solid-svg-icons";
import CategoryCard from "./CategoryCard.jsx";

const categories = [
    { icon: faPaintBrush, title: "Design", bgColor: "bg-teal-500" },
    { icon: faLaptopCode, title: "Development", bgColor: "bg-blue-500" },
    { icon: faLaptopCode, title: "Development", bgColor: "bg-blue-500" },
    { icon: faBriefcase, title: "Business", bgColor: "bg-green-500" },
    { icon: faBullhorn, title: "Marketing", bgColor: "bg-orange-400" },
    { icon: faCamera, title: "Photography", bgColor: "bg-red-400" },
    { icon: faTheaterMasks, title: "Acting", bgColor: "bg-gray-500" },
    { icon: faBook, title: "Business", bgColor: "bg-green-500" },
];

const CategoryList = () => {
    return (
        <section className="py-10 px-[5%]">
            <h2 className="text-2xl font-bold  text-gray-800 mb-6">Choice favourite course from top category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  place-items-center w-full gap-6">
                {categories.map((category, index) => (
                    <CategoryCard key={index} {...category} description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodadipiscing elit, sed do eiusmod" />
                ))}
            </div>
        </section>
    );
};

export default CategoryList;
