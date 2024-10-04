import React, { useEffect, useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const [isLogOut, setIsLogOut] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate()
  const token = localStorage.getItem("token");

  const handleLogOut = () => {
    setIsLogOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate('/');
    }, 2000);
  };

  useEffect(() => {
    if (token) {
      setIsLogOut(false);
    }
  }, [token]);

  const handleLinkClick = () => {
    setExpanded(false); // Collapse the navbar when a link is clicked
  };
  return (
    <Navbar expand="lg" className="bg-light w-100 py-4 shadow position-fixed z-1" expanded={expanded}>
      <Container >
        <Navbar.Brand className="text-primary fw-bold" ><Link style={{ textDecoration: "none" }} to={'/dashboard'}>EMPLOYEE</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
        <Navbar.Collapse id="basic-navbar-nav">
        {token && 
          <Nav className="ms-auto d-flex align-items-center justify-content-center">
           
            
              <Nav.Link>
                <Link onClick={handleLinkClick} className='text-dark fw-bold' style={{ textDecoration: "none" }} to="/dashboard">Home</Link>
              </Nav.Link>
              <Nav.Link>
                <Link onClick={handleLinkClick} className='text-dark fw-bold' style={{ textDecoration: "none" }} to={"/employee-list"}>Employee</Link>
                </Nav.Link>
            
          
              <Nav.Link>
                <Link onClick={() => { handleLogOut() }} className='btn text-white fw-medium' style={{ textDecoration: 'none', backgroundColor: 'black' }}>
                  {isLogOut ? 'logging out...' : 'LogOut'}
                </Link>
              </Nav.Link>
           
          </Nav>
        }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header