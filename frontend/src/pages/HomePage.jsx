import React from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar.jsx";
import Navbar from "../components/Navbar";
import Announcements from "../components/Announcements.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date) => {
    navigate("/AssignRoom", { state: { selectedDate: date.toISOString() } });
  };

  return (
    <div className="">
      <Navbar />
      <Calendar onDateSelect={handleDateSelect} />
      <Announcements />
    </div>
  );
};

export default HomePage;
