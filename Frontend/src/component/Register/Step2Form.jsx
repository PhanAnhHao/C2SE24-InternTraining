const Step2Form = ({ formData, errors, role, onChange, onSubmit, onBack, englishSkillOptions, businessTypeOptions }) => (
    <form onSubmit={onSubmit} className="space-y-5">
        <p className="text-gray-700 font-semibold">Step 2: Additional Information</p>
        {[
            { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your Email' },
            { label: 'Display Name', name: 'userName', type: 'text', placeholder: 'Enter your Display Name' },
            { label: 'Location', name: 'location', type: 'text', placeholder: 'Enter your Location' },
            { label: 'Phone', name: 'phone', type: 'text', placeholder: 'Enter your Phone number' },
            ...(role === 'student'
                ? [
                    { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter your Age (Optional)' },
                    { label: 'School', name: 'school', type: 'text', placeholder: 'Enter your School (Optional)' },
                    { label: 'Course', name: 'course', type: 'text', placeholder: 'Enter your Course (Optional)' },
                ]
                : [
                    { label: 'Detail', name: 'detail', type: 'text', placeholder: 'Enter your Business Detail' },
                ]),
        ].map(({ label, name, type, placeholder }) => (
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
                </div>
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
        ))}
        {/* Trường Type riêng cho Business */}
        {role === 'business' && (
            <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                    Business Type
                </label>
                <div className="relative">
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                        <option value="">Select your Business Type</option>
                        {businessTypeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
        )}
        {/* Trường English Skill riêng cho Student */}
        {role === 'student' && (
            <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="englishSkill">
                    English Skill
                </label>
                <div className="relative">
                    <select
                        id="englishSkill"
                        name="englishSkill"
                        value={formData.englishSkill}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                        <option value="">Select your English Skill (Optional)</option>
                        {englishSkillOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.englishSkill && <p className="text-red-500 text-sm mt-1">{errors.englishSkill}</p>}
            </div>
        )}
        <div className="mt-6 flex justify-between">
            <button
                type="button"
                onClick={onBack}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
            >
                Back
            </button>
            <button
                type="submit"
                className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50 transition-colors duration-300"
            >
                Register
            </button>
        </div>
    </form>
);
export default Step2Form;