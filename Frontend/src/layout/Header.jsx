import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import { NavLink } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem("token");
        if (authData) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [loggedIn])

    return (
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-[5%] py-4 bg-white shadow-md z-50">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <div className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-gray-700 transform -rotate-45">IT</span>
                </div>
            </div>

            <div className="flex items-center space-x-8">
                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 text-gray-600">
                    <NavLink to="/" className={({ isActive }) => isActive ? "font-bold text-teal-400" : "hover:text-teal-400"}>
                        Home
                    </NavLink>
                    <NavLink to="/course" className={({ isActive }) => isActive ? "font-bold text-teal-400" : "hover:text-teal-400"}>
                        Courses
                    </NavLink>
                    {loggedIn && (
                        <NavLink to="/your-courses" className={({ isActive }) => isActive ? "font-bold text-teal-400" : "hover:text-teal-400"}>
                            Your Courses
                        </NavLink>
                    )}
                    <NavLink to="/blog-page" className={({ isActive }) => isActive ? "font-bold text-teal-400" : "hover:text-teal-400"}>
                        Blog
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "font-bold text-teal-400" : "hover:text-teal-400"}>
                        About Us
                    </NavLink>
                </nav>

                {/* User Profile */}
                {loggedIn ? (
                    <AvatarDropdown />
                ) : (
                    <div className="flex justify-center space-x-4">
                        <Link to="/login" className="w-32">
                            <button className="w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link to="/register" className="w-32">
                            <button className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors">
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
