import React, { useState } from "react";
import { db, auth, storage } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./ReportPage.css";

const ReportPage = () => {
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState("");
  const [severity, setSeverity] = useState("low");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleLocationSearch = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Firebase Storage if there is an image
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on("state_changed", null, (error) => {
          console.error("Error uploading image:", error);
          setLoading(false);
        }, async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        });
      }

      // Add the report data to Firestore
      const reportRef = await addDoc(collection(db, "reports"), {
        issueType,
        severity,
        location,
        description,
        latitude,
        longitude,
        imageUrl,
        createdAt: new Date(),
        status: "Pending", // Default status
      });

      // Redirect to Admin Dashboard after submission
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="">Select Issue</option>
            <option value="Pothole">Pothole</option>
            <option value="Water Logging">Water Logging</option>
            <option value="Road Break">Road Break</option>
          </select>
        </div>
        
        <div>
          <label>Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationSearch}
            placeholder="Enter Location"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            required
          />
        </div>

        <div>
          <label>Upload Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportPage;
