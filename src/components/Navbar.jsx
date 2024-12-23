import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the JWT token from localStorage (or cookies, depending on your implementation)
    localStorage.removeItem('token');

    // Redirect the user to the login page
    navigate('/signIn');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark h-[5vh] w-[100vw]">
      <div className="container-fluid">
        <button 
          className="navbar-brand btn btn-link text-light p-0" 
          onClick={() => navigate('/dashboard')}
        >
          Inventory Management
        </button>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button 
                className="btn btn-link nav-link text-light" 
                onClick={() => navigate('/')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="btn btn-link nav-link text-light" 
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="btn btn-link nav-link text-light" 
                onClick={() => navigate('/admin/reports')}
              >
                Reports
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="btn btn-link nav-link text-light" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
