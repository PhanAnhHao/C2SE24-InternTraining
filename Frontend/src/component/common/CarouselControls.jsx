import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const CarouselControls = ({ onPrev, onNext, isPrevDisabled, isNextDisabled }) => {
    return (
        <div className="flex gap-2 mt-6 ml-auto ">
            <button
                onClick={onPrev}
                disabled={isPrevDisabled}
                className={`w-10 h-10 rounded-md flex items-center justify-center 
                hover:scale-105 transition-transform duration-300 cursor-pointer 
                ${
                    isPrevDisabled ? "bg-[#BEE3E9]" : "bg-[#49BBBD]"
                }`}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-white text-lg" />
            </button>

            <button
                onClick={onNext}
                disabled={isNextDisabled}
                className={`w-10 h-10 rounded-md flex items-center justify-center
                 hover:scale-105 transition-transform duration-300 cursor-pointer
                 ${
                    isNextDisabled ? "bg-[#BEE3E9]" : "bg-[#49BBBD]"
                }`}
            >
                <FontAwesomeIcon icon={faChevronRight} className="text-white text-lg" />
            </button>
        </div>
    );
};

export default CarouselControls;