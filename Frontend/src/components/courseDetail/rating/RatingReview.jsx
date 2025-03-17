import RatingSummary from "./RatingSummary";
import ReviewList from "./ReviewList";
import Buttons from "./Buttons.jsx";
const RatingReview=() => {
    return (
        <div className="w-3/5">

        <Buttons/>
        <div className="bg-[#DEEDFD] p-6 rounded-lg shadow-md  h-auto">

            <RatingSummary />
            <ReviewList />
        </div>
        </div>
    );
}
export default RatingReview