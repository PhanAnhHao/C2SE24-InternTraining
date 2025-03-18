const RatingSummary = () => {
    const ratings = [
        { stars: 5, percentage: 80 },
        { stars: 4, percentage: 70 },
        { stars: 3, percentage: 60 },
        { stars: 2, percentage: 50 },
        { stars: 1, percentage: 40 }
    ];

    return (
        <div className="bg-[#DEEDFD] p-6  flex items-center space-x-6">
            {/* Phần tổng rating */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-40">
                <p className="text-2xl font-bold text-gray-500">4 out of 5</p>
                <div className="flex justify-center space-x-1 text-yellow-500 text-2xl my-2">
                    {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                    ))}
                </div>
                <p className="text-gray-500 text-sm">Top Rating</p>
            </div>

            {/* Thanh progress */}
            <div className="flex-1 space-y-2">
                {ratings.map((rating) => (
                    <div key={rating.stars} className="flex items-center space-x-2 space-y-2">
                        <p className="w-14 text-gray-500 font-semibold text-sm">{rating.stars} Stars</p>
                        <div className="w-full h-2 bg-gray-300 rounded-full">
                            <div
                                className="h-2 bg-teal-500 rounded-full"
                                style={{ width: `${rating.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingSummary;
