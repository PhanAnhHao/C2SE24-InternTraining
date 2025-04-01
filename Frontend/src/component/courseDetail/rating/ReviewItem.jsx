const ReviewItem=({ name, rating, time, text }) =>{
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-2 flex space-x-4">
            <img className="w-12 h-12 rounded-full object-cover"   src={"/img/course.png"} alt={name} />
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <p className="font-bold">{name}</p>
                        <div className="flex text-yellow-500 text-sm">
                            {[...Array(rating)].map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">{time}</p>
                </div>
                <p className="text-gray-600 mt-2">{text}</p>
            </div>
        </div>
    );
}
export default ReviewItem