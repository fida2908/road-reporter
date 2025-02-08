import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Reported Issues</h2>
      <table>
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Severity</th>
            <th>Location</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.issueType}</td>
              <td>{report.severity}</td>
              <td>{report.location}</td>
              <td>{report.description}</td>
              <td>
                {report.imageBase64 && (
                  <img src={report.imageBase64} alt="Report" width="100" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
