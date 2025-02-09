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

  // ✅ State variables for location tracking
   //const [latitude, setLatitude] = useState(null);
 // const [longitude, setLongitude] = useState(null);
  // const [location, setLocation] = useState("");

  // ✅ Stores reported issues for the map
  const [reportedIssues, setReportedIssues] = useState([]);

  // ✅ Check authentication from localStorage on mount
  useEffect(() => {
    setIsAdminAuthenticated(localStorage.getItem('isAdminAuthenticated') === 'true');
    setIsUserAuthenticated(localStorage.getItem('isUserAuthenticated') === 'true');
  }, []);

  // ✅ Fetch reported issues from Firestore in real time
  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReportedIssues(issues);
    });

    return () => unsubscribe(); // Cleanup listener
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
          <Route
            path="/"
            element={
              <HomePage
                reportedIssues={reportedIssues}
                //setLatitude={setLatitude}
                //setLongitude={setLongitude}
                //setLocation={setLocation}
              />
            }
          />
          <Route path="/user-auth" element={<UserAuthPage onLogin={handleUserLogin} />} />
          <Route path="/admin-auth" element={<AdminAuthPage onLogin={handleAdminLogin} />} />

          {/* ✅ Ensure authenticated users can report an issue */}
          <Route
            path="/report"
            element={
              isUserAuthenticated ? (
                <ReportPage
                 // setLatitude={setLatitude}
                 // setLongitude={setLongitude}
                 // setLocation={setLocation}
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

// ✅ HomePage Component (Updated to Pass `setLatitude` and `setLongitude` to MapComponent)
const HomePage = ({ reportedIssues, setLatitude, setLongitude, setLocation }) => {
  const [reportedPotholes, setReportedPotholes] = useState(0);
  const [fixedPotholes, setFixedPotholes] = useState(0);
  const [routeReady, setRouteReady] = useState(false);

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

  const handleRouteButtonClick = () => {
    setRouteReady(true); // To trigger route calculation in MapComponent
  };

  return (
    <>
      <header className="App-header">
        {/* Logo added to top left, small size */}
        <img src="logo.png" alt="Logo" className="logo" />
        <h1 className="animated-heading">Report. Repair. Resolve – Make Roads Safer!</h1>
        <Link to="/user-auth" className="report-button">Report an Issue</Link>
        <Link to="/admin-auth" className="login-button">Login for Authority</Link>
      </header>

      <section className="map-section">
        <h2>Live Map</h2>
        {/* ✅ Pass setLatitude, setLongitude, and setLocation to MapComponent */}
        <MapComponent
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setLocation={setLocation}
          reportedIssues={reportedIssues}
          routeReady={routeReady}  // Passing this to trigger route calculation
        />
      </section>

      <section className="statistics-section">
        <h3>{reportedPotholes} potholes reported, {fixedPotholes} fixed this month!</h3>
      </section>

      {/* Button to trigger best path calculation */}
      <button onClick={handleRouteButtonClick} className="find-path-button">
        Find Best Path
      </button>
    </>
  );
};

export default App;
