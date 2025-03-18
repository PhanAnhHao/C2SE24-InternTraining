import ReviewItem from "./ReviewItem";

const reviews = [
    { name: "Lina", rating: 5, time: "3 Months", text: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively..." },
    { name: "Lina", rating: 5, time: "3 Months", text: "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively..." }
];

const ReviewList =() => {
    return (
        <div>
            {reviews.map((review, index) => (
                <ReviewItem key={index} {...review} />
            ))}
        </div>
    );
}
export default ReviewList