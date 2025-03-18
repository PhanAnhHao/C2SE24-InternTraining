// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthPage from "./component/AuthPage/AuthPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/user-login" element={<AuthPage />} />
//         <Route path="/user-register" element={<AuthPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/Login/Login';
import RegisterPage from './component/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/user-register" element={<RegisterPage />} />
        {/* <Route path="/" element={<Navigate to="/user-login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
