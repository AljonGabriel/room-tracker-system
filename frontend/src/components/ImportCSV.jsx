import React from 'react';

const ImportCSV = () => {
  const handleClick = () => {
    alert('CSV import coming soon!');
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className='btn btn-secondary btn-outline btn-sm cursor-pointer'>
        Import CSV
      </button>
    </div>
  );
};

export default ImportCSV;
