// AdminDashboard.js
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/issues")
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching issues:", error));
  }, []);

  const updateStatus = (id, status) => {
    fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((updatedIssue) => {
        setIssues(issues.map(issue => issue._id === id ? updatedIssue : issue));
      })
      .catch((error) => console.error("Error updating issue:", error));
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
            <th>Image</th>
            <th>Description</th>
            <th>Location</th>
            <th>Issue Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td><img src={issue.imageUrl} alt="Issue" className="issue-image" /></td>
              <td>{issue.description}</td>
              <td>{issue.location}</td>
              <td>{issue.issueType}</td>
              <td className={`status ${issue.status.toLowerCase()}`}>{issue.status}</td>
              <td>
                <select
                  value={issue.status}
                  onChange={(e) => updateStatus(issue._id, e.target.value)}
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
