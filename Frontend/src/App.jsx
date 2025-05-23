import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/Login/Login';
import RegisterPage from './component/Register/Register';
import CoursePage from "./pages/CoursePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import RequestProfile from "./pages/RequestProfile.jsx";
import CousresAttended from "./component/CourseAttended/CousresAttended.jsx";
import AccessStudentProfile from "./component/RequestProfile/AccessStudentProfile.jsx";
import MyBlog from "./component/Profile/MyBlog.jsx";
import UpdateBlog from "./component/BlogPage/UpdateBlog/UpdateBlog.jsx";
import UpdateCoursePage from "./pages/UpdateCoursePage.jsx";
import ResetPasswordForm from './component/ForgotPassword/ResetPassword.jsx';

const NotFound = () => {
  return (
    <div className="page-not-found" role="alert" >
      404. NOT FOUND
    </div>
  )
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/blog-page" element={<BlogPage />} />
            <Route path="/blogs/:blogId" element={<BlogDetail />} />
            <Route path="/my-blog" element={<MyBlog />} />
            <Route path="/update-blog/:blogId" element={<UpdateBlog />} />
            <Route path="/course-attended" element={<CousresAttended />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />


            <Route path="/profile" element={<Profile />} />
            <Route path="/test-page/:testId" element={<TestPage />} />
            <Route path="/submit-test" element={<SubmitTest />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/create-blog" element={<CreateBlog />} />

          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/online-learning/:courseId" element={<OnlineLearningPage />} />

          <Route path="/dashboard" element={<AdminLayout />}>
            <Route path="/dashboard/online-learning" element={<OnlineLearningManager />} />
            <Route path="/dashboard/accounts" element={<ManageAccount />} />
            <Route path="/dashboard/students-test" element={<ManageStudentTest />} />
            <Route path="/dashboard/courses" element={<ManageCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/online-learning" element={<OnlineLearningManager />} />
            <Route path="/dashboard/reviews" element={<ManageReviews />} />
          </Route>
          <Route path="/dashboard/courses/create-course" element={<CreateCoursePage />} />
          <Route path="/dashboard/courses/:courseId/edit" element={<UpdateCoursePage />} />

          <Route path="/request-profile" element={<RequestProfile />} />
          <Route path="/business/view-student/:token" element={<RequestProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>

  );
}

export default App;
