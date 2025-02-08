import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MapComponent from './MapComponent';
import ReportPage from './ReportPage';
import AdminAuthPage from './AdminAuthPage'; // Signup/Login page for admin
import UserAuthPage from './UserAuthPage';   // Signup/Login page for users
import AdminDashboard from './AdminDashboard';
import { db, auth, storage } from './firebaseConfig'; // Correct import

import { collection, query, onSnapshot } from "firebase/firestore";

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin and user authentication from localStorage
    const adminAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const userAuth = localStorage.getItem('isUserAuthenticated') === 'true';
    setIsAdminAuthenticated(adminAuth);
    setIsUserAuthenticated(userAuth);
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true'); // Persist admin authentication
  };

  const handleUserLogin = () => {
    setIsUserAuthenticated(true);
    localStorage.setItem('isUserAuthenticated', 'true'); // Persist user authentication
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-auth" element={<UserAuthPage onLogin={handleUserLogin} />} />
          <Route path="/admin-auth" element={<AdminAuthPage onLogin={handleAdminLogin} />} />
          <Route path="/report" element={isUserAuthenticated ? <ReportPage /> : <UserAuthPage onLogin={handleUserLogin} />} />
          <Route path="/admin-dashboard" element={isAdminAuthenticated ? <AdminDashboard /> : <AdminAuthPage onLogin={handleAdminLogin} />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage = () => {
  const [reportedPotholes, setReportedPotholes] = useState(0);
  const [fixedPotholes, setFixedPotholes] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "potholes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let reportedCount = 0, fixedCount = 0;
      snapshot.docs.forEach((doc) => {
        reportedCount++;
        if (doc.data().status === "Fixed") {
          fixedCount++;
        }
      });
      setReportedPotholes(reportedCount);
      setFixedPotholes(fixedCount);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

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
        <h3>{reportedPotholes} potholes reported, {fixedPotholes} fixed this month!</h3>
      </section>
    </>
  );
};

export default App;
