import React from "react";
import OccupiedTimeLogs from "../components/OccupiedTimeLogs";
import Navbar from "../components/Navbar";
import OccupiedRoomsList from "../components/OccupiedRoomsList";

const OccupiedRoomsPage = () => {
  return (
    <div>
      <Navbar />
      <OccupiedRoomsList />
    </div>
  );
};

export default OccupiedRoomsPage;
