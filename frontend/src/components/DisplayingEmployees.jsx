import AddEmployee from './AddEmployee';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateEmp from './UpdateEmp.jsx';
import DeleteEmployee from './DeleteEmployee.jsx';
import DelAllProff from './DelAllProff.jsx';
import ImportCSV from './ImportCSV.jsx';

const DisplayingEmployees = () => {
  const storedDean = localStorage.getItem('loggedInDean');
  const loggedInDean = storedDean ? JSON.parse(storedDean) : null;

  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const deans = (employees || []).filter(
    (emp) => emp?.role === 'Dean' || emp?.role === 'SuperAdmin',
  );
  const instructors = (employees || []).filter(
    (emp) => emp?.role === 'Instructor',
  );

  console.log('Deans:', deans);

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
  }, []);

  console.log('Employees:', employees);
  console.log('loggedInDean:', loggedInDean?.fullName);

  return (
    <div className='min-h-screen bg-base-200 py-10'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex gap-3 items-center mb-6'>
          <AddEmployee setEmployees={setEmployees} />
        </div>

        <div className='flex gap-3 items-center mb-6'>
          <ImportCSV
            setEmployees={setEmployees}
            API_BASE={API_BASE}
          />
        </div>

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
                      {' '}
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
        <div className='max-h-[500px] overflow-y-auto rounded-lg shadow-inner bg-gray-700 p-2'>
          <div className='flex items-center m-3 gap-2'>
            <h2 className='text-xl font-semibold text-white'>Instructors</h2>
            <DelAllProff />
          </div>
          <table className='table table-zebra w-full bg-base-100 rounded-lg shadow-md'>
            <thead className='bg-neutral text-neutral-content'>
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
              {instructors.map((emp, index) => (
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
                        {' '}
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
  );
};

export default DisplayingEmployees;
