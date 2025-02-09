import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  // Fetch Reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Ensure all fields are fetched correctly
        }));
        setReports(reportData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Mark issue as Fixed and trigger update
  const handleMarkAsFixed = async (reportId) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: "Fixed" });

      // Remove the fixed report from state
      setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));

      // Notify the map component to refresh
      window.dispatchEvent(new Event("reportUpdated"));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Reported Issues</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Severity</th>
            <th>Location</th>
            <th>Description</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.issueType || "N/A"}</td>
                <td>{report.severity || "N/A"}</td>
                <td>{report.location || "N/A"}</td>
                <td>{report.description || "N/A"}</td>
                <td>
                  {report.imageBase64 ? (
                    <img src={report.imageBase64} alt="Report" width="100" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{report.status || "Pending"}</td>
                <td>
                  {report.status !== "Fixed" && (
                    <button onClick={() => handleMarkAsFixed(report.id)}>Mark as Fixed</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No reports available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
