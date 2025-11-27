import React from "react";
import { useState, useEffect } from "react";

const BuildingReference = ({
  onSelectedBuilding,
  onSelectedFloor,
  floorData,
  rooms,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  console.log(onSelectedBuilding, onSelectedFloor);
  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-base-content">
            Building Reference
          </h2>
        </div>

        {/* Subheader */}
        <div className="flex items-center justify-between">
          <h3>
            {onSelectedBuilding} – {onSelectedFloor}
          </h3>
          <span className="badge badge-outline badge-sm text-xs">
            {rooms?.length} rooms
          </span>
        </div>

        {/* Image Frame */}
        <div className="w-full border border-base-300 rounded-lg overflow-hidden shadow-sm bg-base-100 flex flex-col items-center justify-center">
          {floorData?.image ? (
            <>
              <img
                src={floorData.image}
                alt={`${onSelectedBuilding} ${onSelectedFloor}F Floor Plan`}
                className="w-full h-auto object-contain cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              {/* Caption text */}
              <p className="mt-2 text-xs text-base-content opacity-70">
                Click image to expand
              </p>
            </>
          ) : (
            <div className="text-sm text-base-content opacity-60">
              No floor plan available
            </div>
          )}
        </div>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400"
            onClick={() => setShowImageModal(false)}
          >
            ✕
          </button>

          <img
            src={floorData.image}
            alt="Expanded Floor Plan"
            className="max-h-[90vh] w-auto object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default BuildingReference;
