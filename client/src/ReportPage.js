import "./ReportPage.css";
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import MapComponent from "./MapComponent";

const ReportPage = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [locationName, setLocationName] = useState("Click on map to select location");
  const [issueType, setIssueType] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Function to compress images before storing
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = 800; // Max size for compression
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        callback(canvas.toDataURL("image/jpeg", 0.7)); // Compress quality 70%
      };
    };
  };

  // ✅ Handle Image Upload and Compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      compressImage(file, (compressedBase64) => {
        setImage(compressedBase64);
        setImagePreview(compressedBase64);
      });
    }
  };

  // ✅ Handle Report Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPosition || !issueType || !description) {
      alert("Please fill in all fields and select a location on the map.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "reports"), {
        issueType,
        severity,
        description,
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
        location: locationName,
        imageBase64: image, // Store compressed Base64 image
        timestamp: new Date(),
      });

      console.log("Report submitted successfully!");
      setSuccessMessage("Report submitted successfully! ✅");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset form after submission
      setIssueType("");
      setSeverity("Low");
      setDescription("");
      setSelectedPosition(null);
      setLocationName("Click on map to select location");
      setImage(null);
      setImagePreview(null);
      setImageName("");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="report-container">
      <h2>Report an Issue</h2>
      {successMessage && <div className="success-popup">{successMessage}</div>}

      <div className="report-grid">
        <div className="left-column">
          <label>Issue Type</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
            <option value="">Select Issue</option>
            <option value="Pothole">Pothole</option>
            <option value="Water-Logging">Water-Logging</option>
            <option value="Road Break">Road Break</option>
          </select>

          <label>Severity</label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Location</label>
          <input type="text" value={locationName} readOnly />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <div className="right-column">
          <div className="map-section">
            <MapComponent 
              setLatitude={(lat) => setSelectedPosition((prev) => ({ ...prev, lat }))} 
              setLongitude={(lng) => setSelectedPosition((prev) => ({ ...prev, lng }))} 
              setLocation={setLocationName} 
              showMarkers={true} 
              submittedLocation={selectedPosition} 
            />
          </div>

          <div className="image-upload">
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <p>{imageName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="submit-container">
        <button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
