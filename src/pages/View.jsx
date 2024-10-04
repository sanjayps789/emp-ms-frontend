import React, { useEffect, useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { updateEmployeeAPI, getEmployeeByIdAPI } from '../services/allAPI'; // Changed addEmployeeAPI to updateEmployeeAPI
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function View() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        f_Image: null,
        f_Name: "",
        f_Email: "",
        f_Mobile: "",
        f_Designation: "",
        f_gender: "",
        f_Course: [],
        f_status: ""
    });
    console.log(inputData);
    const fileInputRefImage = useRef(null);
    const [preview, setPreview] = useState("");

    const [validImage, setValidImage] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPhone, setValidPhone] = useState(false);

    // Fetch employee data by ID
    const handleGetDataById = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            try {
                const reqHeader = {
                    "Authorization": `Bearer ${token}`
                };
                const result = await getEmployeeByIdAPI(id, reqHeader);
                console.log(result);
                if (result.status === 200) {
                    setInputData({
                        f_Image: null, // Reset image; we'll handle it separately
                        f_Name: result.data.employee.f_Name,
                        f_Email: result.data.employee.f_Email,
                        f_Mobile: result.data.employee.f_Mobile,
                        f_Designation: result.data.employee.f_Designation,
                        f_gender: result.data.employee.f_gender,
                        f_Course: result.data.employee.f_Course ? result.data.employee.f_Course.split(',') : [], // Assuming courses are comma-separated
                        f_status: result.data.employee.f_status || ""
                    });
                    setPreview(result.data.employee.f_Image);
                    // Note: You cannot set file input's value programmatically for security reasons
                } else {
                    toast.error(result.response?.data?.message || "Failed to fetch employee data");
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while fetching employee data");
            }
        }
    };

    const handleInputData = (e) => {
        const { name, value, type, checked } = e.target;

        // ---------Validation Name------------
        if (name === "f_Name") {
            if (/^[a-zA-Z0-9]{5,}$/.test(value) || value === "") {
                setValidName(false);
            } else {
                setValidName(true);
            }
        }

        // ---------Validation Email------------
        if (name === "f_Email") {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value === "") {
                setValidEmail(false);
            } else {
                setValidEmail(true);
            }
        }

        // ---------Validation Phone------------
        if (name === "f_Mobile") {
            if (/^[0-9]{10}$/.test(value) || value === "") {
                setValidPhone(false);
            } else {
                setValidPhone(true);
            }
        }

        // Handle multiple checkbox for courses
        if (name === "f_Course") {
            let updatedCourses = [...inputData.f_Course];
            if (checked) {
                updatedCourses.push(value);
            } else {
                updatedCourses = updatedCourses.filter(course => course !== value);
            }
            setInputData({ ...inputData, f_Course: updatedCourses });
            return; // Exit early since we've handled the course
        }

        setInputData({ ...inputData, [name]: value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputData({ ...inputData, f_Image: file });
        }
    };

    useEffect(() => {
        if (
            inputData.f_Image?.type === "image/png" ||
            inputData.f_Image?.type === "image/jpg" ||
            inputData.f_Image?.type === "image/jpeg"
        ) {
            setPreview(URL.createObjectURL(inputData.f_Image));
            setValidImage(false);
        } else if (inputData.f_Image === null) {
            setPreview(null);
            setValidImage(false);
        } else {
            setPreview(null);
            setValidImage(true);
        }
    }, [inputData.f_Image]);

    useEffect(() => {
        handleGetDataById(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleUpdateData = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = inputData;
            if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_gender || f_Course.length === 0) {
                toast.info("All fields are required");
                return;
            }

            try {
                const formData = new FormData();
                if (inputData.f_Image) {
                    formData.append("f_Image", inputData.f_Image);
                }
                formData.append("f_Name", f_Name);
                formData.append("f_Email", f_Email);
                formData.append("f_Mobile", f_Mobile);
                formData.append("f_Designation", f_Designation);
                formData.append("f_gender", f_gender);
                formData.append("f_Course", f_Course.join(',')); // Assuming API expects comma-separated string
                formData.append("f_status", inputData.f_status);

                const reqHeader = {
                    "Authorization": `Bearer ${token}`
                };

                const result = await updateEmployeeAPI(id, formData, reqHeader); // Use updateEmployeeAPI with id
                console.log(result);
                if (result.status === 200) {
                    toast.success("Employee Updated Successfully");
                    navigate("/employee-list");
                } else {
                    toast.error(result.response?.data?.message || "Failed to update employee");
                }

            } catch (error) {
                console.error(error);
                toast.error("An error occurred while updating employee");
            }
        }
    };

    return (
        <div style={{paddingTop:"100px"}} className='w-100 d-flex justify-content-center align-items-center pb-5'>
            <div className="container w-100">
                <h3 className='text-start text-lg-center text-black fw-bold py-4'>Edit Employee</h3>
                <div className="row w-100 mx-auto">
                    <div style={{ width: "400px" }} className="card container col-lg-12 p-3 py-5 bg-dark-subtle">
                        <Form onSubmit={handleUpdateData}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className='fw-medium'>Name</Form.Label>
                                <Form.Control
                                    name='f_Name'
                                    value={inputData.f_Name}
                                    onChange={handleInputData}
                                    type="text"
                                    placeholder="Enter Name"
                                />
                            </Form.Group>
                            {validName && <p className='text-danger'>Enter a valid name (minimum 5 alphanumeric characters)</p>}

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='fw-medium'>Email</Form.Label>
                                <Form.Control
                                    value={inputData.f_Email}
                                    onChange={handleInputData}
                                    name='f_Email'
                                    type="email"
                                    placeholder="Enter Email"
                                />
                            </Form.Group>
                            {validEmail && <p className='text-danger'>Enter a valid email</p>}

                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label className='fw-medium'>Mobile No</Form.Label>
                                <Form.Control
                                    value={inputData.f_Mobile}
                                    onChange={handleInputData}
                                    name='f_Mobile'
                                    type="text"
                                    placeholder="Enter Phone Number"
                                />
                            </Form.Group>
                            {validPhone && <p className='text-danger'>Invalid Mobile Number</p>}

                            <Form.Group className='mb-3' controlId="formGridState">
                                <Form.Label className='fw-medium pe-3'>Designation</Form.Label>
                                <Form.Select
                                    value={inputData.f_Designation}
                                    onChange={handleInputData}
                                    name='f_Designation'
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="HR">HR</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales">Sales</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicGender">
                                <Form.Label className='fw-medium'>Gender</Form.Label> <br />
                                <div className='d-flex'>
                                    <div className='d-flex align-items-center me-3'>
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            name="f_gender"
                                            value="Male"
                                            checked={inputData.f_gender === "Male"}
                                            onChange={handleInputData}
                                        />
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            name="f_gender"
                                            value="Female"
                                            checked={inputData.f_gender === "Female"}
                                            onChange={handleInputData}
                                        />
                                    </div>
                                </div>
                            </Form.Group>

                            {/* Course as checkboxes */}
                            <Form.Group className="mb-3" controlId="formHorizontalCheck">
                                <Form.Label className='fw-medium'>Course</Form.Label><br />
                                <Form.Check
                                    name='f_Course'
                                    value="MCA"
                                    type="checkbox"
                                    label="MCA"
                                    checked={inputData.f_Course.includes("MCA")}
                                    onChange={handleInputData}
                                />
                                <Form.Check
                                    name='f_Course'
                                    value="BCA"
                                    type="checkbox"
                                    label="BCA"
                                    checked={inputData.f_Course.includes("BCA")}
                                    onChange={handleInputData}
                                />
                                <Form.Check
                                    name='f_Course'
                                    value="BSC"
                                    type="checkbox"
                                    label="BSC"
                                    checked={inputData.f_Course.includes("BSC")}
                                    onChange={handleInputData}
                                />
                            </Form.Group>

                            {/* Image upload */}
                            <Form.Group className="mb-3" controlId="formBasicImage">
                                <Form.Label className='fw-medium'>Image Upload</Form.Label>
                                <Form.Control
                                    ref={fileInputRefImage}
                                    accept='image/png, image/jpg, image/jpeg'
                                    onChange={handleImage}
                                    type="file"
                                />
                            </Form.Group>
                            {validImage && <div className='text-danger my-3'>*Upload only the following file types: jpg, jpeg, png*</div>}

                            {/* Image Preview */}
                            {preview && (
                                <div className='mb-3'>
                                    <img src={`http://localhost:8000/uploads/${preview}`} alt="Preview" style={{ width: '100px', height: '100px' }} />
                                </div>
                            )}

                            <div className='text-center'>
                                <Button className='btn-lg' variant="primary" type="submit">
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            <ToastContainer theme='dark' autoClose={1800} />
        </div>
    );
}

export default View;
