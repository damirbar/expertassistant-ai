import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import ExpertsList from './pages/Experts/ExpertsList';
import ExpertForm from './pages/Experts/ExpertForm';
import CallsList from './pages/Calls/CallsList';
import CallDetails from './pages/Calls/CallDetails';
import CallInitiate from './pages/Calls/CallInitiate';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router basename="/">
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/experts" 
                element={
                  <PrivateRoute>
                    <ExpertsList />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/experts/new" 
                element={
                  <PrivateRoute>
                    <ExpertForm />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/experts/:id" 
                element={
                  <PrivateRoute>
                    <ExpertForm />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/calls" 
                element={
                  <PrivateRoute>
                    <CallsList />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/calls/:id" 
                element={
                  <PrivateRoute>
                    <CallDetails />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/initiate-call" 
                element={
                  <PrivateRoute>
                    <CallInitiate />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
