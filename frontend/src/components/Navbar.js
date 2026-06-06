import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BSNavbar className="tp-navbar" expand="md">
      <Container fluid style={{ maxWidth: 900, padding: '0 16px' }}>
        <BSNavbar.Brand as={Link} to="/">
          Task<span>Planet</span>
        </BSNavbar.Brand>

        {user ? (
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tp-text)' }} className="d-none d-sm-block">
                @{user.username}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline-danger"
              className="tp-nav-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Button
              as={Link}
              to="/login"
              size="sm"
              variant="outline-primary"
              className="tp-nav-btn"
            >
              Login
            </Button>
            <Button
              as={Link}
              to="/register"
              size="sm"
              variant="primary"
              className="tp-nav-btn"
              style={{ background: 'var(--tp-primary)', borderColor: 'var(--tp-primary)' }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Container>
    </BSNavbar>
  );
};

export default Navbar;