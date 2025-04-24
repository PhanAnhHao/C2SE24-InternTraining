const Header = ({ onHomeClick }) => (
    <div className="flex items-center cursor-pointer ml-8 mt-5 mb-[-120px]" onClick={onHomeClick}>
        <div className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
            <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
        </div>
        <span className="ml-4 font-semibold text-sky-500 hover:underline">Home</span>
    </div>
);
export default Header;