import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActiveCourseList from "./components/courses/activeCourses/ActiveCourseList.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import  LoginPage from "./pages/Login.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
// Render React app với Router
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<CoursePage/>} />
                <Route path="/course/1" element={<CourseDetailPage/>} />

            </Routes>
        </Router>
    </StrictMode>,
);
