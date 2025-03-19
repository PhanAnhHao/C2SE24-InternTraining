import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/Login/Login';
import RegisterPage from './component/Register/Register';
import CoursePage from "./pages/CoursePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/user-register" element={<RegisterPage />} />
        <Route path="/" element={<CoursePage />} />
        <Route path="/course/1" element={<CourseDetailPage />} />
        <Route path="/blog-page" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
