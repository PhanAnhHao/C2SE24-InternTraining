const Footer = () => {
    return (
        <footer className="bg-[#252641] text-white py-16 px-[5%] text-center">
            {/* Logo */}
            <div className="flex justify-center items-center mb-10">
                <div
                    className="relative w-12 h-12 flex items-center justify-center border-4 border-cyan-400 transform rotate-45">
                    <span className="text-2xl font-bold text-white transform -rotate-45">IT</span>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <h3 className="text-lg font-semibold">Subscribe to get our Newsletter</h3>
            <div className="mt-4 flex justify-center gap-6">
                <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 w-64 rounded-lg  outline-none bg-white text-black"
                />
                <button className="bg-[#49BBBD] px-4 py-2 rounded-lg text-white font-semibold hover:bg-cyan-500">
                    Subscribe
                </button>
            </div>

            {/* Links */}
            <div className="mt-6 text-sm space-x-4">
                <a href="#" className="hover:underline">Careers</a>
                <span>|</span>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <span>|</span>
                <a href="#" className="hover:underline">Terms & Conditions</a>
            </div>

            {/* Copyright */}
            <p className="mt-4 text-xs text-gray-400">© 2025 </p>
        </footer>
    );
};

export default Footer;
