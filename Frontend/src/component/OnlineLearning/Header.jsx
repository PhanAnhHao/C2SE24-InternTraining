import { FaArrowLeft } from 'react-icons/fa';

const Header = () => {
    const handleBack = () => {
        // Placeholder for navigation logic (e.g., go back to the previous page)
        console.log("Navigating back to the previous page");
        alert("Trở về trang trước");
    };

    return (
        <header className="flex items-center p-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-sm">
            <button
                onClick={handleBack}
                className="mr-4 text-white hover:text-gray-200 transition-colors duration-150"
            >
                <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
                <div className="flex items-center">
                    <div className="relative w-7 h-7 flex items-center justify-center border-2 border-white rounded transform rotate-45">
                        <span className="text-sm font-bold text-white transform -rotate-45">IT</span>
                    </div>
                </div>
                <h1 className="text-lg font-medium tracking-tight">Kiến Thức Nhập Môn IT</h1>
            </div>
        </header>
    );
};

export default Header;