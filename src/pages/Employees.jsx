import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEmployeeAPI, getAllEmployeesAPI, updateEmployeeStatusAPI } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'react-bootstrap';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updatingStatusIds, setUpdatingStatusIds] = useState([]);
  const [searchKey,setSearchKey] = useState("")
  const SERVER_URL = "http://localhost:8000";

  // Fetch all employees
  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      const result = await getAllEmployeesAPI(reqHeader);
      if (result.status === 200) {
        setEmployees(result.data.employees);
        setEmployees(result.data.employees);
        setCurrentPage(1);

      } else {
        toast.error(result.response?.data?.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async(e) => {
    setSearchKey(e.target.value)
    const token = localStorage.getItem("token");
    const reqHeader = {
      "Authorization": `Bearer ${token}`
    }
    const result = await getAllEmployeesAPI(reqHeader)
    const searchResult = result.data.employees.filter((emp) => {
      return emp.f_Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
             emp.f_Email.toLowerCase().includes(e.target.value.toLowerCase()) ||
             emp.f_Mobile.includes(e.target.value);
    });    setEmployees(searchResult)
  }

  
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete an employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      };
      const result = await deleteEmployeeAPI(id, reqHeader);
      if (result.status === 200) {
        toast.success("Employee deleted successfully");
        fetchEmployees(); // Refresh the employee list
      } else {
        toast.error(result.response?.data?.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("An error occurred while deleting the employee");
    } finally {
      setLoading(false);
    }
  };

  // Update employee status
  const handleEditStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      // Indicate which employee's status is being updated
      setUpdatingStatusIds((prev) => [...prev, id]);

      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const payload = {
        f_status: newStatus
      };

      const result = await updateEmployeeStatusAPI(id, payload, reqHeader);
      if (result.status === 200) {
        toast.success("Employee status updated successfully");
        // Update the local state without refetching
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.f_Id === id ? { ...emp, f_status: newStatus } : emp
          )
        );
      } else {
        toast.error(result.response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating the status");
    } finally {
      // Remove the employee id from updatingStatusIds
      setUpdatingStatusIds((prev) => prev.filter((empId) => empId !== id));
    }
  };

const handleSortById = () => {
  const sortedEmployees = [...employees].sort((a, b) => a.f_Id - b.f_Id);
  setEmployees(sortedEmployees);
};

const handleSortByName = () => {
  const sortedEmployees = [...employees].sort((a, b) => a.f_Name.localeCompare(b.f_Name));
  setEmployees(sortedEmployees);
};

 const handleSortByEmail = () => {
  const sortedEmployees = [...employees].sort((a, b) => a.f_Email.localeCompare(b.f_Email));
  setEmployees(sortedEmployees);
};

const handleSortByDate = () => {
  const sortedEmployees = [...employees].sort((a, b) => new Date(a.f_Date) - new Date(b.f_Date));
  setEmployees(sortedEmployees);
}

  const isUpdatingStatus = (id) => updatingStatusIds.includes(id);

  return (
    <div style={{ paddingTop: "110px" }} className='w-100'>
      <div className='container'>
        <h3 className='text-start text-black fw-bold py-4'>Employee List</h3>
        <div className="row mb-2">
          <div style={{ height: "80px" }} className="col-lg-12 d-flex justify-content-lg-end justify-content-center align-items-center bg-dark-subtle py-3">
            <h6 className='mt-1 px-3 fw-bold'>Total Count: {employees.length}</h6>
            <Link className='btn btn-primary' to="/add-employee">
              <i className="fa-solid fa-plus"></i> Create Employee
            </Link>
          </div>
        </div>
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-lg-8 col-md-8 col-9 mb-2">
            <div className="input-group">
              <span className="input-group-text" id="search-addon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                onChange={handleSearch}
                value={searchKey}
                type="text"
                className="form-control"
                placeholder="Search by name, email, etc..."
                aria-label="Search"
                aria-describedby="search-addon"
                // Implement search functionality as needed
              />
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-3">
            {/* Filter */}
            <Dropdown>
            <Dropdown.Toggle className='btn btn-primary'  id="dropdown-basic">
              Sort
            </Dropdown.Toggle>
      
            <Dropdown.Menu>
              <Dropdown.Item>
                <button onClick={handleSortByName} className='btn btn-light'>SortByName</button>
                </Dropdown.Item>
              <Dropdown.Item>
                <button onClick={handleSortById} className='btn btn-light'>SortById</button>
                </Dropdown.Item>
                <Dropdown.Item>
                <button onClick={handleSortByDate} className='btn btn-light'>SortByDate</button>
                </Dropdown.Item>
                <Dropdown.Item>
                <button onClick={handleSortByEmail} className='btn btn-light'>SortByEmail</button>
                </Dropdown.Item>
            </Dropdown.Menu>
            
          </Dropdown>
          </div>
        </div>
        {/* Employees Table */}
        <div className="row">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-hover table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile No</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Course</th>
                    <th scope="col">Create Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : employees.length > 0 ? (
                    employees.map((emp, index) => (
                      <tr key={emp.f_Id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            className='img-fluid rounded-circle'
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            src={emp.f_Image ? `${SERVER_URL}/uploads/${emp.f_Image}` : "/default-profile.png"}
                            alt="profile"
                          />
                        </td>
                        <td>{emp.f_Name}</td>
                        <td>{emp.f_Email}</td>
                        <td>{emp.f_Mobile}</td>
                        <td>{emp.f_Designation}</td>
                        <td>{emp.f_gender}</td>
                        <td>{emp.f_Course}</td>
                        <td>{new Date(emp.f_CreateDate).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="form-select"
                            value={emp.f_status}
                            onChange={(e) => handleEditStatus(emp.f_Id, e.target.value)}
                            disabled={isUpdatingStatus(emp.f_Id)}
                          >
                            <option value="Active">Active</option>
                            <option value="Deactive">Deactive</option>
                          </select>
                          {isUpdatingStatus(emp.f_Id) && (
                            <small className="text-muted">Updating...</small>
                          )}
                        </td>
                        <td className='d-flex justify-content-center'>
                          <Link className='btn btn-warning btn-sm px-2 me-2' to={`/view/${emp.f_Id}`}>
                            <i className="fa-solid fa-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(emp.f_Id)}
                            className='btn btn-danger btn-sm'
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer theme='dark' autoClose={1800} />
    </div >
  );
}

export default Employees;
