import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CategoryCard = ({ icon, title, description, bgColor }) => {
    return (
        <div className="bg-white p-6 w-76 py-20  rounded-xl shadow-md text-center hover:shadow-lg transition cursor-pointer">
            <div className={`w-12 h-12 mx-auto flex items-center justify-center rounded-lg ${bgColor}`}>
                <FontAwesomeIcon icon={icon} className="text-white text-xl" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm mt-2">{description}</p>
        </div>
    );
};

export default CategoryCard;
