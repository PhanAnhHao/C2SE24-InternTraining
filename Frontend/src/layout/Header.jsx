import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return (
        <header
            className="fixed  top-0 left-0 w-full flex items-center justify-between px-[5%] py-4 bg-white shadow-md z-50">
            {/* Logo */}
            <div className="flex items-center  cursor-pointer" onClick={() => navigate("/")} >
                <div
                    className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45 " >IT</span>
                </div>
            </div>

            <div className="flex items-center space-x-8">
                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 text-gray-600">
                    <a href="#" className="hover:text-black">Home</a>
                    <a href="#" className="hover:text-black">Courses</a>
                    <a href="#" className="hover:text-black">Careers</a>
                    <a href="#" className="hover:text-black">Blog</a>
                    <a href="#" className="hover:text-black">About Us</a>
                </nav>

                {/* User Profile */}
                <div className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-gray-900">Lina</span>
                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 text-sm" />
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
