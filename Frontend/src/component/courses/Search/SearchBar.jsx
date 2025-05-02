import React, { useState } from 'react';

const SearchBar = ({ courses, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        language: '',
        minRating: ''
    });

    // Extract unique options for language
    const uniqueLanguages = [...new Set(courses.map(course => course.language || 'Unknown'))];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        let filteredCourses = courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = !filters.language || course.language === filters.language;
            const matchesRating = !filters.minRating || (course.avgRating >= parseFloat(filters.minRating));

            return matchesSearch && matchesLanguage && matchesRating;
        });
        if (onSearch) onSearch(filteredCourses);
    };

    return (
        <div
            className="w-full p-4 h-[200px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
                backgroundImage: "url('/img/bgSearch.png')",
                backgroundBlendMode: 'overlay'
            }}
        >
            <div className="flex items-center space-x-4 w-full max-w-6xl">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search your favourite course"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Language Filter */}
                <select name="language" className="p-2 border border-gray-300 rounded-md focus:outline-none bg-white" value={filters.language} onChange={handleFilterChange}>
                    <option value="">Language</option>
                    {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>

                {/* Rating Filter */}
                <select name="minRating" className="p-2 border border-gray-300 rounded-md focus:outline-none bg-white" value={filters.minRating} onChange={handleFilterChange}>
                    <option value="">Rating</option>
                    <option value="0">0+</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5</option>
                </select>

                {/* Search Button */}
                <button className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600" onClick={handleSearch}>
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;