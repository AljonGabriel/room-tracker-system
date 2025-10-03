import AddEmployee from "./AddEmployee";

import { useEffect, useState } from "react";
import axios from "axios";
import UpdateEmp from "./UpdateEmp.jsx";
import DeleteEmployee from "./DeleteEmployee.jsx";

const DisplayingEmployees = () => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5001/api/employees/getemp"
        );
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
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Manage Employees</h1>
          <AddEmployee setEmployees={setEmployees} />
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-100 rounded-lg shadow-md">
            <thead className="bg-neutral text-neutral-content">
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Name</th>
                <th className="text-left">Role</th>
                <th className="text-left">Hiring Date</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.role}</td>
                  <td>
                    <b>
                      {new Date(emp.hiringDate).toLocaleDateString("en-US")}
                    </b>
                  </td>

                  {/* Email removed from form, so placeholder here */}
                  <td>
                    <div className="flex gap-2">
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
