import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate = useNavigate()
  const [inputData,setInputData] = useState({
    f_username:"",
    f_Pwd:""
  })

  const [validUsername,setValidEmail] = useState(false)
  const [validPassword,setValidPassword] = useState(false)


const handleInputData = (e) =>{
  const {name,value} = e.target
  // ---------Validation Email------------
if(name=="f_username"){
  if(value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) || ""){
    setValidEmail(false)
  }else{
    setValidEmail(true)
  }
}
// ---------Validation Password------------
if(name=="f_Pwd"){
  if(value.match(/^[a-zA-Z0-9]{5,9}$/) || ""){
    setValidPassword(false)
  }else{
    setValidPassword(true)
  }
}

  setInputData({...inputData,[name]:value})
}


const handleLogin = async(e) => {
  e.preventDefault()
  const {f_username,f_Pwd} = inputData

  if(f_username=="" || f_Pwd==""){
    toast.error("All fields are required")

  }else{
    try {
      const result = await loginAPI(inputData)
      console.log(result);
      if(result.status==200){
        toast.success("Login Successful")
        localStorage.setItem("token",result.data.token)
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      }else{
        toast.error(result.response.data.message) 
      }
    } catch (error) {
      console.log(error);
    }
  }
}

console.log(inputData);

  return (
    <div style={{height:"100vh",width:"100%"}}  className='d-flex justify-content-center align-items-center w-100'>
        <div className="container">
            <div className="row w-100 d-flex justify-content-center align-items-center p-5">
                <div style={{width:"500px"}} className="card shadow-lg col-lg-12 rounded py-4" >
                  <h3 className='text-center text-primary fw-bold mb-2'>LOGIN</h3>
                  <Form className='p-4'>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='fw-bold'>Username</Form.Label>
                        <Form.Control value={inputData.f_username} onChange={handleInputData} name='f_username' type="email" placeholder="Enter email" />
                      </Form.Group>
                      {validUsername &&<span className='text-danger fw-bold'>Invalid Email (Valid Email eg: 8DpZK@example.com)</span>}

    
                      <Form.Group className="mb-3" controlId="formBasicPwd">
                        <Form.Label className='fw-bold'>Password</Form.Label>
                        <Form.Control value={inputData.f_Pwd} onChange={handleInputData} name='f_Pwd' type="text" placeholder="Enter email" />
                      </Form.Group>
                      {validPassword&& <p className='text-danger fw-bolder mt-2'>Invalid Password (Minimum 5 characters)</p>}

                      <Button onClick={handleLogin} variant="primary" type="submit">
                    Submit
                  </Button>
                  </Form>
        
                </div>
            </div>
        </div>
        <ToastContainer theme='dark' autoClose={1800} />

    </div>
  )
}

export default Login