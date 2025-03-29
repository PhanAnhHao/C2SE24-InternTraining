import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();

    // Lấy tên trang từ đường dẫn URL
    const pageTitles = {
        "/admin/dashboard": "Dashboard",
        "/admin/students": "Manage Student",
        "/admin/courses": "Manage Course",
        "/admin/online-learning": "Manage Online Learning",
        "/admin/reviews": "Manage Review Rating",
        "/admin/profile": "Profile",
    };

    const currentPath = location.pathname;
    const pageTitle = pageTitles[currentPath] || "Dashboard";

    return (
        <header className="bg-white p-4 flex items-center justify-between w-full shadow-md">
            {/* Page Title */}
            <div className="flex items-center text-gray-500 text-sm">
                <span className="text-gray-400">Pages</span>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-700">{pageTitle}</span>
            </div>

            {/* Search Bar */}
            <div className="flex items-center w-full max-w-lg bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="bg-transparent ml-2 outline-none text-gray-700 w-full placeholder-gray-400"
                />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
                <FaBell className="text-gray-600 text-2xl cursor-pointer" />
                <FaUserCircle className="text-gray-600 text-3xl cursor-pointer" />
            </div>
        </header>
    );
};

export default Header;
