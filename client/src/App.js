import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MapComponent from './MapComponent';
import ReportPage from './ReportPage';
import AdminAuthPage from './AdminAuthPage'; // Signup/Login page for admin
import UserAuthPage from './UserAuthPage';   // Signup/Login page for users
import AdminDashboard from './AdminDashboard';

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin authentication from localStorage
    const adminAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAdminAuthenticated(adminAuth);
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true'); // Persist authentication
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-auth" element={<UserAuthPage />} />
          <Route path="/admin-auth" element={<AdminAuthPage onLogin={handleAdminLogin} />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/admin-dashboard" element={isAdminAuthenticated ? <AdminDashboard /> : <AdminAuthPage onLogin={handleAdminLogin} />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage = () => {
  return (
    <>
      <header className="App-header">
        <h1 className="animated-heading">Report. Track. Fix – Make Roads Safer!</h1>
        <Link to="/user-auth" className="report-button">Report an Issue</Link>
        <Link to="/admin-auth" className="login-button">Login for Authority</Link>
      </header>

      <section className="map-section">
        <h2>Live Map</h2>
        <MapComponent />
      </section>

      <section className="statistics-section">
        <h3>X potholes reported, Y fixed this month!</h3>
      </section>
    </>
  );
};

export default App;
