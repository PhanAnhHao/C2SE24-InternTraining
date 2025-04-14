import React from "react";

const Filter = ({ onFilterChange }) => {
    const handleRatingChange = (e) => {
        onFilterChange("rating", e.target.value);
    };

    const handleUserChange = (e) => {
        onFilterChange("user", e.target.value);
    };

    const handleDateChange = (e) => {
        onFilterChange("date", e.target.value);
    };

    return (
        <div className="flex flex-wrap gap-4 mb-4">
            {/* Rating Filter */}
            <div className="flex items-center">
                <label htmlFor="rating" className="mr-2 text-gray-600">
                    Xếp hạng:
                </label>
                <select
                    id="rating"
                    onChange={handleRatingChange}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">All</option>
                    <option value="1">1 ★</option>
                    <option value="2">2 ★</option>
                    <option value="3">3 ★</option>
                    <option value="4">4 ★</option>
                    <option value="5">5 ★</option>
                </select>
            </div>

            {/* User Filter */}
            <div className="flex items-center">
                <label htmlFor="user" className="mr-2 text-gray-600">
                    Người dùng:
                </label>
                <input
                    type="text"
                    id="user"
                    placeholder="Search by name"
                    onChange={handleUserChange}
                    className="border px-2 py-1 rounded"
                />
            </div>

            {/* Date Filter */}
            <div className="flex items-center">
                <label htmlFor="date" className="mr-2 text-gray-600">
                    Ngày:
                </label>
                <input
                    type="date"
                    id="date"
                    onChange={handleDateChange}
                    className="border px-2 py-1 rounded"
                />
            </div>
        </div>
    );
};

export default Filter;
