import { FaHome, FaBookOpen, FaUserCircle } from "react-icons/fa";

const NavigationBar = () => {
    return (
        <nav className="bg-teal-500 text-white py-4 px-6 shadow-md fixed w-full top-0 left-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <a href="/" className="flex items-center space-x-2 hover:text-teal-200 transition-colors duration-200">
                        <FaHome className="text-lg" />
                        <span className="font-medium">Home</span>
                    </a>
                    <a href="/courses" className="flex items-center space-x-2 hover:text-teal-200 transition-colors duration-200">
                        <FaBookOpen className="text-lg" />
                        <span className="font-medium">Courses</span>
                    </a>
                </div>
                <a href="/profile" className="flex items-center space-x-2 hover:text-teal-200 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="font-medium">Profile</span>
                </a>
            </div>
        </nav>
    );
};

export default NavigationBar;
