import CourseManager from "../component/UpdateCourse/CourseManager.jsx";

const UpdateCoursePage = () => {
    return (
        <div className="flex h-screen">
            <div className="flex-1">
                <div className="bg-white rounded-xl">
                    <CourseManager />
                </div>
            </div>
        </div>
    );
};

export default UpdateCoursePage;