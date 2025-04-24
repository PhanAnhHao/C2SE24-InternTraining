const RoleSelector = ({ role, onRoleChange }) => (
    <div className="space-y-5">
        <p className="text-gray-700">
            Your role <span className="font-semibold text-red-500">(Required*)</span>
        </p>
        <div className="flex gap-3">
            <button
                type="button"
                className={
                    role === 'student'
                        ? 'w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors duration-300'
                        : 'w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300'
                }
                onClick={() => onRoleChange('student')}
            >
                Student
            </button>
            <button
                type="button"
                className={
                    role === 'business'
                        ? 'w-full bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors duration-300'
                        : 'w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300'
                }
                onClick={() => onRoleChange('business')}
            >
                Business
            </button>
        </div>
    </div>
);
export default RoleSelector;