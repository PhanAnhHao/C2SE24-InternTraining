import { useState } from "react";
import CarouselControls from "./CarouselControls.jsx";

const List = ({ title, seeAllLink, items, renderItem, itemsPerPage = 4, bg = "white" }) => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="py-10 rounded-xl" style={{ backgroundColor: bg }}>
            <div className="px-[5%]">
                {/* Tiêu đề */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    {seeAllLink && <a href={seeAllLink} className="text-[#49BBBD] text-lg font-bold">See all</a>}
                </div>

                {/* Danh sách items */}
                <div className="relative flex flex-col  items-center">
                    <div className="flex w-full justify-between gap-6">
                        {visibleItems.map((item, index) => (
                            <div key={index}>{renderItem(item)}</div>
                        ))}
                    </div>

                    {/* Nút chuyển trang */}
                    <CarouselControls
                        onPrev={() => setStartIndex(prev => Math.max(prev - 1, 0))}
                        onNext={() => setStartIndex(prev => Math.min(prev + 1, items.length - itemsPerPage))}
                        isPrevDisabled={startIndex === 0}
                        isNextDisabled={startIndex + itemsPerPage >= items.length}
                    />
                </div>
            </div>
        </div>
    );
};

export default List;
