import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/Login/Login';
import RegisterPage from './component/Register/Register';
import CoursePage from "./pages/CoursePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import "./App.css";
import Homepage from './pages/Homepage.jsx';
import Layout from './Layout.jsx';
import OnlineLearningManager from './pages/Admin/OnlineLearningManager.jsx';
import ManageStudent from './pages/Admin/ManageStudent.jsx';
import ManageStudentTest from './pages/Admin/ManageStudentTest.jsx';
import ManageCourse from './pages/Admin/ManageCourse.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';

const NotFound = () => {
  return (
    <div className="page-not-found" role="alert" >
      404. NOT FOUND
    </div>
  )
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/{id}" element={<CourseDetailPage />} />
          <Route path="/blog-page" element={<BlogPage />} />
          <Route path="/admin/online-learning" element={<OnlineLearningManager />} />
          <Route path="/admin/students" element={<ManageStudent />} />
          <Route path="/admin/students-test" element={<ManageStudentTest />} />
          <Route path="/admin/courses" element={<ManageCourse />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/user-register" element={<RegisterPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
