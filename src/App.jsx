import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import View from './pages/View'
import Header from './components/Header'
import Add from './pages/Add'

function App() {

  return (
   <>
   <Header/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/add-employee" element={<Add/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/employee-list" element={<Employees/>}/>
        <Route path="/view/:id" element={<View/>}/>
        <Route path="/*" element={<Navigate to="/"/>}/>
      </Routes>
   </>
  )
}

export default App
