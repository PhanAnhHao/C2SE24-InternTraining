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
          {/* <Route path="/blog-detail" element={<BlogDetail />} />     */}
          <Route path="/blogs/:blogId" element={<BlogDetail />} />


          <Route path="/profile" element={<Profile />} />
          <Route path="/test-page" element={<TestPage />} />
          <Route path="/submit-test" element={<SubmitTest />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create-blog" element={<CreateBlog />} />

        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/online-learning" element={<OnlineLearningManager />} />
          <Route path="/admin/accounts" element={<ManageAccount />} />
          <Route path="/admin/students-test" element={<ManageStudentTest />} />
          <Route path="/admin/courses" element={<ManageCourse />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/online-learning" element={<OnlineLearningManager />} />
          <Route path="/admin/reviews" element={<ManageReviews />} />
        </Route>


        <Route path="/business/create-course" element={<CreateCoursePage />} />

        {/*Test*/}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
