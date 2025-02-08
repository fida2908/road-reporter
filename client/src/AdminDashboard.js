import React, { useEffect, useState } from "react";
import { db, auth, storage } from './firebaseConfig'; // Correct import
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Update issue status
  const updateStatus = async (id, newStatus) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { status: newStatus });

      // Update state after Firestore update
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: newStatus } : report
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Location</th>
            <th>Coordinates</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.issueType}</td>
              <td>{report.description}</td>
              <td>{report.location}</td>
              <td>
                {report.latitude}, {report.longitude}
              </td>
              <td className={`status ${report.status?.toLowerCase() || "pending"}`}>
                {report.status || "Pending"}
              </td>
              <td>
                <select
                  value={report.status || "Pending"}
                  onChange={(e) => updateStatus(report.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
