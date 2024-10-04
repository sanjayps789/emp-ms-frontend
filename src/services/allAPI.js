import SERVER_URL from "./baseUrl"
import { commonAPI } from "./commonAPI"

export const loginAPI = async(user) =>{
    return await commonAPI("POST",`${SERVER_URL}/login`,user,"")
}

export const addEmployeeAPI = async(employee,reqHeader) =>{
    return await commonAPI("POST",`${SERVER_URL}/add-employee`,employee,reqHeader)
}

export const getAllEmployeesAPI = async(reqHeader) =>{
    return await commonAPI("GET",`${SERVER_URL}/get-all-employees`,null,reqHeader)
}

export const getEmployeeByIdAPI = async(eid,reqHeader) =>{
    return await commonAPI("GET",`${SERVER_URL}/get-employee-byId/${eid}`,"",reqHeader)
}

export const deleteEmployeeAPI = async(eid,reqHeader) =>{
    return await commonAPI("DELETE",`${SERVER_URL}/delete-employee/${eid}`,"",reqHeader)
}

export const updateEmployeeAPI = async(employeeId,employee,reqHeader) =>{
    return await commonAPI("PATCH",`${SERVER_URL}/edit-employee/${employeeId}`,employee,reqHeader)
}

export const updateEmployeeStatusAPI = async(employeeId,reqBody,reqHeader) =>{
    return await commonAPI("PATCH",`${SERVER_URL}/update-employee-status/${employeeId}`,reqBody,reqHeader)
}

