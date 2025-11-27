import { useState, useEffect } from "react";
import axios from "axios";
import buildingLayouts from "../data/buildingData.js";

const UnOccupiedRooms = () => {
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [buildingFilter, setBuildingFilter] = useState("All");
  const [floorFilter, setFloorFilter] = useState("All");

  const isLocal = window.location.hostname === "localhost";
  const API_BASE = isLocal
    ? "http://localhost:5001"
    : import.meta.env.VITE_API_BASE;

  // Flatten buildingLayouts into a list of all rooms
  const getAllRooms = () => {
    const allRooms = [];
    for (const [buildingName, floors] of Object.entries(buildingLayouts)) {
      for (const [floorNumber, floorData] of Object.entries(floors)) {
        floorData.rooms.forEach((roomName) => {
          allRooms.push({
            building: buildingName,
            floor: parseInt(floorNumber, 10),
            name: roomName,
          });
        });
      }
    }
    return allRooms;
  };

  useEffect(() => {
    const getOccupiedRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/rooms/assignments`);
        const occupied = res.data; // [{ room: "R202 - Computer Lab 7", building:"...", floor:2 }, ...]

        setOccupiedRooms(occupied);

        // Step 1: Get all rooms
        const allRooms = getAllRooms();

        // Step 2: Filter out occupied ones (exact match with DB room field)
        const unoccupied = allRooms.filter(
          (room) => !occupied.some((occ) => occ.room === room.name)
        );

        setAvailableRooms(unoccupied);
      } catch (error) {
        console.error("❌ Failed to fetch occupied rooms", error);
      }
    };

    getOccupiedRooms();
  }, []);

  // Filter by building and floor
  const filteredRooms = availableRooms.filter((room) => {
    const buildingMatch =
      buildingFilter === "All" || room.building === buildingFilter;
    const floorMatch =
      floorFilter === "All" || room.floor === parseInt(floorFilter, 10);
    return buildingMatch && floorMatch;
  });

  // Get floors for selected building
  const floorsForBuilding =
    buildingFilter === "All"
      ? []
      : Object.keys(buildingLayouts[buildingFilter] || {});

  return (
    <div className="space-y-4 text-sm">
      <h2 className="text-base font-semibold">Available Rooms</h2>

      {/* Building Filter */}
      <div>
        <label className="mr-2 text-xs font-medium">Filter by Building:</label>
        <select
          value={buildingFilter}
          onChange={(e) => {
            setBuildingFilter(e.target.value);
            setFloorFilter("All"); // reset floor when building changes
          }}
          className="select select-sm select-bordered"
        >
          <option value="All">All Buildings</option>
          {Object.keys(buildingLayouts).map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
      </div>

      {/* Floor Filter (only shows when building selected) */}
      {buildingFilter !== "All" && (
        <div>
          <label className="mr-2 text-xs font-medium">Filter by Floor:</label>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="select select-sm select-bordered"
          >
            <option value="All">All Floors</option>
            {floorsForBuilding.map((floor) => (
              <option key={floor} value={floor}>
                {floor}F
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Room List */}
      <div className="space-y-1">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, idx) => (
            <div
              key={idx}
              className="px-3 py-2 border border-base-300 rounded bg-base-100 shadow-sm"
            >
              <span className="font-medium">{room.name}</span>
              <span className="text-xs text-base-content opacity-70">
                — {room.building}, Floor {room.floor}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-base-content opacity-60">
            No available rooms
          </p>
        )}
      </div>
    </div>
  );
};

export default UnOccupiedRooms;
