import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db} from './firebaseConfig'; // Correct import
import { collection, getDocs } from "firebase/firestore";

// Custom Marker Icons
const redIcon = new L.Icon({
  iconUrl: "/marker-icon-red.png", // User's location
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl: "/marker-icon-yellow.png", // Reported issue
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to update map center dynamically
const UpdateMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
};

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [reports, setReports] = useState([]);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

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
      }
    };

    fetchReports();
  }, []);

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      {/* Render map only if the user's location is obtained */}
      {position ? (
        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <UpdateMapCenter position={position} />

          {/* User Location Marker */}
          <Marker position={position} icon={redIcon}>
            <Popup>You are here!</Popup>
          </Marker>

          {/* Reported Issues Markers */}
          {reports.map(report => (
            <Marker key={report.id} position={[report.latitude, report.longitude]} icon={yellowIcon}>
              <Popup>
                <strong>{report.issueType}</strong><br />
                {report.description}<br />
                <i>{report.location}</i>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Fetching location...</p> // Display a message while waiting for location
      )}
    </div>
  );
};

export default MapComponent;
