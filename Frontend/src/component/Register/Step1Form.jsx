import { FaEyeSlash, FaEye } from 'react-icons/fa';
const Step1Form = ({ formData, errors, onChange, onSubmit, showPassword, showConfirmPassword, togglePasswordVisibility, toggleConfirmPasswordVisibility }) => (
    <form onSubmit={onSubmit} className="space-y-5">
        <p className="text-gray-700 font-semibold">Step 1: Account Information</p>
        {[
            { label: 'Username', name: 'username', type: 'text', placeholder: 'Enter your Username' },
            { label: 'Password', name: 'password', type: showPassword ? 'text' : 'password', placeholder: 'Enter your Password', isPassword: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: showConfirmPassword ? 'text' : 'password', placeholder: 'Confirm your Password', isConfirmPassword: true },
        ].map(({ label, name, type, placeholder, isPassword, isConfirmPassword }) => (
            <div key={name}>
                <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
                    {label}
                </label>
                <div className="relative">
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    )}
                    {isConfirmPassword && (
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    )}
                </div>
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
        ))}
        <div className="mt-6 flex justify-end">
            <button
                type="submit"
                className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50 transition-colors duration-300"
            >
                Next
            </button>
        </div>
    </form>
);
export default Step1Form;