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
import AdminLayout from "./AdminLayout.jsx";
import OnlineLearningManager from './pages/Admin/OnlineLearningManager.jsx';
import ManageReviews from "./pages/Admin/ManageReviews.jsx";
import ManageAccount from './pages/Admin/ManageAccount.jsx';
import ManageStudentTest from './pages/Admin/ManageStudentTest.jsx';
import ManageCourse from './pages/Admin/ManageCourse.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import Profile from './component/Profile/Profile.jsx';
import TestPage from './component/TestPage/TestPage.jsx';
import SubmitTest from './component/TestPage/SubmitTest.jsx';
import ChangePassword from './component/ChangePassword/ChangePassword.jsx';
import CreateBlog from './component/BlogPage/CreateBlog/CreateBlog.jsx';
import OnlineLearningPage from "./pages/OnlineLearningPage.jsx";

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
          <Route path="/course/1" element={<CourseDetailPage />} />
          <Route path="/blog-page" element={<BlogPage />} />
          <Route path="/blogs/:blogId" element={<BlogDetail />} />


          <Route path="/profile" element={<Profile />} />
          <Route path="/test-page/:testId" element={<TestPage />} />
          <Route path="/submit-test" element={<SubmitTest />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create-blog" element={<CreateBlog />} />

          <Route path="/online-learning" element={<OnlineLearningPage />} />

        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<AdminLayout />}>
          <Route path="/dashboard/online-learning" element={<OnlineLearningManager />} />
          <Route path="/dashboard/accounts" element={<ManageAccount />} />
          <Route path="/dashboard/students-test" element={<ManageStudentTest />} />
          <Route path="/dashboard/courses" element={<ManageCourse />} />
          <Route path="/dashboard/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/online-learning" element={<OnlineLearningManager />} />
          <Route path="/dashboard/reviews" element={<ManageReviews />} />
          <Route path="/dashboard/create-course" element={<CreateCoursePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
