import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MapComponent from './MapComponent';
import ReportPage from './ReportPage';
import AdminAuthPage from './AdminAuthPage';
import UserAuthPage from './UserAuthPage';
import AdminDashboard from './AdminDashboard';
import { db } from './firebaseConfig';
import { collection, query, onSnapshot } from "firebase/firestore";

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // ✅ Define states for location and reports
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState("");
  const [reportedIssues, setReportedIssues] = useState([]); // Stores reports for MapComponent

  useEffect(() => {
    // Check authentication from localStorage
    setIsAdminAuthenticated(localStorage.getItem('isAdminAuthenticated') === 'true');
    setIsUserAuthenticated(localStorage.getItem('isUserAuthenticated') === 'true');
  }, []);

  useEffect(() => {
    // Fetch reported issues from Firestore
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReportedIssues(issues);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  const handleUserLogin = () => {
    setIsUserAuthenticated(true);
    localStorage.setItem('isUserAuthenticated', 'true');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage reportedIssues={reportedIssues} />} />
          <Route path="/user-auth" element={<UserAuthPage onLogin={handleUserLogin} />} />
          <Route path="/admin-auth" element={<AdminAuthPage onLogin={handleAdminLogin} />} />

          {/* ✅ Ensure authenticated users can report an issue */}
          <Route 
            path="/report" 
            element={
              isUserAuthenticated ? (
                <ReportPage 
                  setLatitude={setLatitude} 
                  setLongitude={setLongitude} 
                  setLocation={setLocation} 
                />
              ) : (
                <UserAuthPage onLogin={handleUserLogin} />
              )
            } 
          />

          <Route 
            path="/admin-dashboard" 
            element={isAdminAuthenticated ? <AdminDashboard /> : <AdminAuthPage onLogin={handleAdminLogin} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

// ✅ Pass reported pothole data to the map component
const HomePage = ({ reportedIssues }) => {
  const [reportedPotholes, setReportedPotholes] = useState(0);
  const [fixedPotholes, setFixedPotholes] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "reports"));
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

    return () => unsubscribe();
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
        <MapComponent reportedIssues={reportedIssues} />
      </section>

      <section className="statistics-section">
        <h3>{reportedPotholes} potholes reported, {fixedPotholes} fixed this month!</h3>
      </section>
    </>
  );
};

export default App;
