import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import AssigningPage from "./pages/AssigningPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/assignRoom" element={<AssigningPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
      </Routes>
    </div>
  );
};

export default App;
