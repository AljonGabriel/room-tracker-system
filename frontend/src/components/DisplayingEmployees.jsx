import AddEmployee from './AddEmployee';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateEmp from './UpdateEmp.jsx';
import DeleteEmployee from './DeleteEmployee.jsx';
import DelAllProff from './DelAllProff.jsx';
import ImportCSV from './ImportCSV.jsx';
import SearchInstructors from './SearchInstructors.jsx';

const DisplayingEmployees = () => {
  const storedDean = localStorage.getItem('loggedInDean');
  const loggedInDean = storedDean ? JSON.parse(storedDean) : null;

  const isLocal = window.location.hostname === 'localhost';
  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Split employees by role
  const deans = (employees || []).filter((emp) => emp?.role === 'Dean');
  const instructors = (employees || []).filter(
    (emp) => emp?.role === 'Instructor',
  );

  // 🔎 Filter instructors by search term
  const filteredInstructors = instructors.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/employees/getemp`);
        setEmployees(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [API_BASE]);

  return (
    <div className='min-h-screen bg-base-200 py-10'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Add Employee */}
        <div className='flex gap-3 items-center mb-6'>
          <AddEmployee
            setEmployees={setEmployees}
            deansList={deans}
          />
        </div>

        {/* Import CSV (SuperAdmin only) */}
        {loggedInDean?.role === 'SuperAdmin' && (
          <div className='flex gap-3 items-center mb-6'>
            <ImportCSV
              setEmployees={setEmployees}
              API_BASE={API_BASE}
            />
          </div>
        )}

        {/* Deans Section */}
        <div className='max-h-[500px] overflow-y-auto rounded-lg shadow-inner bg-gray-700 p-2 mb-2'>
          <h2 className='text-xl font-semibold text-white m-3'>Deans</h2>
          <table className='table table-zebra w-full bg-base-100 rounded-lg shadow-md mb-10'>
            <thead className='bg-neutral text-neutral-content'>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Hiring Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deans.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.username || '—'}</td>
                  <td>
                    <b>
                      {new Date(emp.hiringDate).toLocaleDateString('en-US')}
                    </b>
                  </td>
                  {loggedInDean?.role === 'SuperAdmin' ? (
                    <td>
                      <div className='flex gap-2'>
                        <UpdateEmp
                          empID={emp._id}
                          empName={emp.fullName}
                          empRole={emp.role}
                          empUsername={emp.username}
                          empPwd={emp.pwd}
                          setEmployees={setEmployees}
                        />
                        <DeleteEmployee
                          empID={emp._id}
                          empName={emp.fullName}
                          setEmployees={setEmployees}
                        />
                      </div>
                    </td>
                  ) : (
                    <td>
                      <span className='text-sm italic text-gray-500'>
                        Not authorized
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructors Section */}
        <div className='rounded-lg shadow-inner bg-gray-700 p-2'>
          <div className='flex justify-between items-center m-3'>
            <h2 className='text-xl font-semibold text-white'>Instructors</h2>
            <DelAllProff setEmployees={setEmployees} />
          </div>

          {/* 🔎 Search bar */}
          <SearchInstructors
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Scroll only the table */}
          <div className='max-h-[500px] overflow-y-auto'>
            <table className='table table-zebra w-full bg-base-100 rounded-lg shadow-md'>
              <thead className='bg-neutral text-neutral-content sticky top-0 z-10'>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Hiring Date</th>
                  <th>Reports To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{index + 1}</td>
                    <td>{emp.fullName}</td>
                    <td>{emp?.role}</td>
                    <td>
                      <b>
                        {new Date(emp.hiringDate).toLocaleDateString('en-US')}
                      </b>
                    </td>
                    <td>{emp.reportsTo?.fullName}</td>
                    {loggedInDean?.role === 'SuperAdmin' ||
                    loggedInDean?._id === emp.reportsTo?._id ? (
                      <td>
                        <div className='flex gap-2'>
                          <UpdateEmp
                            empID={emp._id}
                            empName={emp.fullName}
                            empRole={emp.role}
                            setEmployees={setEmployees}
                          />
                          <DeleteEmployee
                            empID={emp._id}
                            empName={emp.fullName}
                            setEmployees={setEmployees}
                          />
                        </div>
                      </td>
                    ) : (
                      <td>
                        <span className='text-sm italic text-gray-500'>
                          Not under your wing
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayingEmployees;
