import React, { useEffect, useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addEmployeeAPI } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add() {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        f_Image: null,
        f_Name: "",
        f_Email: "",
        f_Mobile: "",
        f_Designation: "",
        f_gender: "",
        f_Course: [], // Changed to array to handle multiple selections
        f_status: "Active" // Set default status
    });

    const fileInputRefImage = useRef(null);
    const [preview, setPreview] = useState("");

    const [validImage, setValidImage] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPhone, setValidPhone] = useState(false);

    // Handle input changes
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
                // Avoid duplicates
                if (!updatedCourses.includes(value)) {
                    updatedCourses.push(value);
                }
            } else {
                updatedCourses = updatedCourses.filter(course => course !== value);
            }
            setInputData({ ...inputData, f_Course: updatedCourses });
            return; // Exit early since we've handled the course
        }

        // Handle radio buttons for gender
        if (name === "f_gender") {
            setInputData({ ...inputData, [name]: value });
            return;
        }

        setInputData({ ...inputData, [name]: value });
    };

    // Handle image selection
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputData({ ...inputData, f_Image: file });
        }
    };

    // Update image preview
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const { f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_status } = inputData;

        // Check if all required fields are filled
        if (
            !f_Image ||
            !f_Name ||
            !f_Email ||
            !f_Mobile ||
            !f_Designation ||
            !f_gender ||
            f_Course.length === 0
        ) {
            toast.info("All fields are required");
            return;
        }

        // Check for validation errors
        if (validName || validEmail || validPhone || validImage) {
            toast.error("Please fix the errors in the form before submitting");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("f_Image", f_Image);
            formData.append("f_Name", f_Name);
            formData.append("f_Email", f_Email);
            formData.append("f_Mobile", f_Mobile);
            formData.append("f_Designation", f_Designation);
            formData.append("f_gender", f_gender);
            formData.append("f_Course", f_Course.join(',')); // Assuming API expects comma-separated string
            formData.append("f_status", f_status);

            const reqHeader = {
                "Authorization": `Bearer ${token}`
                // Note: When using FormData, 'Content-Type' is set automatically, including boundary
            };

            const result = await addEmployeeAPI(formData, reqHeader);
            console.log(result);
            if (result.status === 200 || result.status === 201) {
                toast.success("Employee Added Successfully");
                // Reset the form
                setInputData({
                    f_Image: null,
                    f_Name: "",
                    f_Email: "",
                    f_Mobile: "",
                    f_Designation: "",
                    f_gender: "",
                    f_Course: [],
                    f_status: "Active" // Reset to default status
                });
                setPreview(null);
                if (fileInputRefImage.current) {
                    fileInputRefImage.current.value = null;
                }
            } else {
                toast.error(result.response?.data?.message || "Failed to add employee");
            }

        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the employee");
        }
    };

    return (
        <div style={{ paddingTop: "100px" }} className='w-100 d-flex justify-content-center align-items-center pb-5'>
            <div className="container w-100">
                <h3 className='text-start text-lg-center text-black fw-bold py-4'>Create Employee</h3>
                <div className="row w-100 mx-auto">
                    <div style={{ width: "400px" }} className="card container col-lg-12 p-3 py-5 bg-dark-subtle">
                        <Form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className='fw-medium'>Name</Form.Label>
                                <Form.Control
                                    name='f_Name'
                                    value={inputData.f_Name}
                                    onChange={handleInputData}
                                    type="text"
                                    placeholder="Enter Name"
                                    isInvalid={validName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Enter a valid name (minimum 5 alphanumeric characters)
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Email Field */}
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='fw-medium'>Email</Form.Label>
                                <Form.Control
                                    value={inputData.f_Email}
                                    onChange={handleInputData}
                                    name='f_Email'
                                    type="email"
                                    placeholder="Enter Email"
                                    isInvalid={validEmail}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Enter a valid email
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Mobile Number Field */}
                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label className='fw-medium'>Mobile No</Form.Label>
                                <Form.Control
                                    value={inputData.f_Mobile}
                                    onChange={handleInputData}
                                    name='f_Mobile'
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    isInvalid={validPhone}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Invalid Mobile Number (must be 10 digits)
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Designation Field */}
                            <Form.Group className='mb-3' controlId="formGridState">
                                <Form.Label className='fw-medium pe-3'>Designation</Form.Label>
                                <Form.Select
                                    value={inputData.f_Designation}
                                    onChange={handleInputData}
                                    name='f_Designation'
                                    defaultValue=""
                                    isInvalid={!inputData.f_Designation}
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="HR">HR</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales">Sales</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select a designation
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Gender Radio Buttons */}
                            <Form.Group className="mb-3" controlId="formBasicGender">
                                <Form.Label className='fw-medium'>Gender</Form.Label> <br />
                                <div className='d-flex'>
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="Male"
                                        name="f_gender"
                                        value="Male"
                                        checked={inputData.f_gender === "Male"}
                                        onChange={handleInputData}
                                        id="genderMale"
                                        required
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="Female"
                                        name="f_gender"
                                        value="Female"
                                        checked={inputData.f_gender === "Female"}
                                        onChange={handleInputData}
                                        id="genderFemale"
                                        required
                                    />
                                </div>
                                {!inputData.f_gender && (
                                    <div className='text-danger mt-1'>Please select a gender</div>
                                )}
                            </Form.Group>

                            {/* Course Checkboxes */}
                            <Form.Group className="mb-3" controlId="formHorizontalCheck">
                                <Form.Label className='fw-medium'>Course</Form.Label><br />
                                <Form.Check
                                    name='f_Course'
                                    value="MCA"
                                    onChange={handleInputData}
                                    type="checkbox"
                                    label="MCA"
                                    checked={inputData.f_Course.includes("MCA")}
                                />
                                <Form.Check
                                    name='f_Course'
                                    value="BCA"
                                    onChange={handleInputData}
                                    type="checkbox"
                                    label="BCA"
                                    checked={inputData.f_Course.includes("BCA")}
                                />
                                <Form.Check
                                    name='f_Course'
                                    value="BSC"
                                    onChange={handleInputData}
                                    type="checkbox"
                                    label="BSC"
                                    checked={inputData.f_Course.includes("BSC")}
                                />
                                {inputData.f_Course.length === 0 && (
                                    <div className='text-danger mt-1'>Please select at least one course</div>
                                )}
                            </Form.Group>

                            {/* Status Dropdown (Optional) */}
                            {/* If you want to allow setting status during creation, uncomment the following block */}
                            {/* 
                            <Form.Group className="mb-3" controlId="formStatus">
                                <Form.Label className='fw-medium'>Status</Form.Label>
                                <Form.Select
                                    name='f_status'
                                    value={inputData.f_status}
                                    onChange={handleInputData}
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Deactive">Deactive</option>
                                </Form.Select>
                            </Form.Group>
                            */}

                            {/* Image Upload */}
                            <Form.Group className="mb-3" controlId="formBasicImage">
                                <Form.Label className='fw-medium'>Image Upload</Form.Label>
                                <Form.Control
                                    ref={fileInputRefImage}
                                    accept='image/png, image/jpg, image/jpeg'
                                    onChange={handleImage}
                                    type="file"
                                    required
                                    isInvalid={validImage}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Upload only jpg, jpeg, or png files
                                </Form.Control.Feedback>
                            </Form.Group>
                            {preview && (
                                <img
                                    src={preview}
                                    className='w-100 my-3 img-fluid'
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    alt="preview"
                                />
                            )}

                            {/* Submit Button */}
                            <div className='text-center'>
                                <Button className='btn-lg' variant="primary" type="submit">
                                    Submit
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

export default Add;
