const Button = ({ children, onClick, variant = "default", className = "" }) => {
    const baseStyles = "px-4 py-2 rounded font-medium transition-all";
    const variantStyles = {
        default: "bg-[#4FD1C5] text-white hover:bg-[#38B2AC]",
        outline: "border border-gray-500 text-gray-700 hover:bg-gray-200",
        destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
