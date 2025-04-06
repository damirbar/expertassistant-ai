import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 0.5rem 2rem;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: white;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #3498db;
  }
`;

const Button = styled.button`
  margin-left: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const UserInfo = styled.span`
  margin-left: 1.5rem;
  font-size: 0.9rem;
  color: #bdc3c7;
`;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <Logo onClick={() => navigate('/')}>ExpertAssist AI</Logo>
      
      <NavLinks>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/experts">Experts</NavLink>
            <NavLink to="/calls">Calls</NavLink>
            <NavLink to="/initiate-call">New Call</NavLink>
            <UserInfo>
              Hi, {user.firstName}
            </UserInfo>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 