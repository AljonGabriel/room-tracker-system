import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImportCSV = ({ API_BASE, setEmployees }) => {
  const storedDean = localStorage.getItem('loggedInDean');
  const loggedInDean = storedDean ? JSON.parse(storedDean) : null;

  const [rows, setRows] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const expectedHeaders = [
          'Name',
          'Role',
          'Username',
          'Password',
          'Hiring Date',
        ];
        const fileHeaders = results.meta.fields;

        const missingHeaders = expectedHeaders.filter(
          (h) => !fileHeaders.includes(h),
        );

        if (missingHeaders.length > 0) {
          toast.error(`Missing headers: ${missingHeaders.join(', ')}`);
          return;
        }

        setRows(results.data);
      },
    });
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      toast.error('No data to import!');
      return;
    }

    try {
      for (const [i, row] of rows.entries()) {
        if (row.Role === 'Dean') {
          if (!row.Username || !row.Password) {
            toast.error(
              `Row ${i + 2}: Dean must have Username and Password. Skipping...`,
            );
            continue;
          }
        }

        if (row.Role === 'Instructor') {
          if (row.Username || row.Password) {
            toast.error(
              `Row ${
                i + 2
              }: Instructor must NOT have Username/Password. Skipping...`,
            );
            continue;
          }
        }

        const payload = {
          fullName: row.Name,
          role: row.Role,
          username: row.Username || '',
          pwd: row.Password || '',
          hiringDate: row['Hiring Date'],
          reportsTo: loggedInDean?._id,
        };

        const result = await axios.post(
          `${API_BASE}/api/employees/newrecord`,
          payload,
        );

        setEmployees((prev) => [...prev, result.data.newRecord]);
        toast.success(`Employee ${row.Name} added successfully!`);
      }

      setRows([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to import employees');
      console.error(error);
    }
  };

  return (
    <div className=''>
      {/* Instruction steps */}
      <div className='mb-2 text-sm text-gray-600'>
        <p>
          <span className='font-semibold'>1st:</span> Choose a CSV file with
          employee data.
        </p>
        <p>
          <span className='font-semibold'>2nd:</span> Click <em>Import CSV</em>{' '}
          to upload and insert employees.
        </p>
      </div>

      {/* Title bar */}
      <div className='px-3 py-2 border-b bg-gray-100 rounded-t'>
        <label className='text-sm font-semibold text-gray-700'>
          Insert multiple employees
        </label>
      </div>

      {/* Action block */}
      <div className='border border-gray-300 rounded p-3 flex items-center gap-3 bg-gray-50'>
        <input
          ref={fileInputRef}
          type='file'
          accept='.csv'
          onChange={handleFileUpload}
          className='file-input file-input-bordered file-input-sm flex-1'
        />
        <button
          onClick={handleImport}
          className='btn btn-secondary btn-outline btn-sm'>
          Import CSV
        </button>
      </div>

      {rows.length > 0 && (
        <div className='mt-3'>
          <h3 className='font-semibold mb-2'>Preview:</h3>
          <div className='bg-gray-800 text-white p-2 rounded text-sm max-h-48 overflow-y-auto border border-gray-600'>
            {rows.map((row, idx) => (
              <div
                key={idx}
                className='border-b border-gray-700 py-1'>
                <span className='font-medium'>{row.Name}</span> — {row.Role} —{' '}
                {row['Hiring Date']}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCSV;
