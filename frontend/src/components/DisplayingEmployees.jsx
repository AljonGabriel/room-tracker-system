import AddEmployee from './AddEmployee';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateEmp from './UpdateEmp.jsx';
import DeleteEmployee from './DeleteEmployee.jsx';

const DisplayingEmployees = () => {
  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const deans = employees.filter((emp) => emp.role === 'Dean');
  const instructors = employees.filter((emp) => emp.role === 'Instructor');

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

  return (
    <div className='min-h-screen bg-base-200 py-10'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center mb-6'>
          <AddEmployee setEmployees={setEmployees} />
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
                        setEmployees={setEmployees}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='max-h-[500px] overflow-y-auto rounded-lg shadow-inner bg-gray-700 p-2'>
          <h2 className='text-xl font-semibold text-white m-3'>Instructors</h2>
          <table className='table table-zebra w-full bg-base-100 rounded-lg shadow-md'>
            <thead className='bg-neutral text-neutral-content'>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Hiring Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.role}</td>
                  <td>
                    <b>
                      {new Date(emp.hiringDate).toLocaleDateString('en-US')}
                    </b>
                  </td>
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
                        setEmployees={setEmployees}
                      />
                    </div>
                  </td>
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
