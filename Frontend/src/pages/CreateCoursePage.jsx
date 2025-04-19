import LessonList from "../component/CreateCourse/LessonList.jsx";
import CourseHeader from "../component/CreateCourse/CourseHeader.jsx";
import CourseManager from "../component/CreateCourse/CourseManager.jsx";

const CreateCoursePage = () => {
    return (
        <div className="flex h-screen ">
            <div className="flex-1 ">
                <div className=" bg-white  rounded-xl ">
                    <CourseManager />
                </div>
                </div>
            </div>
            );
            };

            export default CreateCoursePage;
