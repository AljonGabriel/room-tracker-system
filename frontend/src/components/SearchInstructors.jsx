import React from "react";

const SearchInstructors = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="form-control w-full max-w-xs my-2">
      <input
        type="text"
        placeholder="Search instructors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered input-sm w-full"
      />
    </div>
  );
};

export default SearchInstructors;
