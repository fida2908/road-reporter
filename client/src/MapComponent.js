import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "./firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";

// Custom Icons
const userLocationIcon = new L.Icon({
  iconUrl: "/blue-marker.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [1, -34],
});

const reportedLocationIcon = new L.Icon({
  iconUrl: "/black-marker.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [1, -34],
});

// Handle Click on Map to Get Location
const MapClickHandler = ({ setLocation, setLatitude, setLongitude, setSelectedPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLatitude(lat);
      setLongitude(lng);

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then((res) => res.json())
        .then((data) => {
          const locationName = data.display_name || "Unknown location";
          setLocation(locationName);
          setSelectedPosition({ lat, lng, name: locationName });
        })
        .catch(() => {
          setLocation("Unknown location");
          setSelectedPosition({ lat, lng, name: "Unknown location" });
        });
    },
  });
  return null;
};

// Main Map Component
const MapComponent = ({ setLocation, setLatitude, setLongitude, submittedLocation }) => {
  const [position, setPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [reportedLocations, setReportedLocations] = useState([]); // Store reported locations

  // Fetch Current User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Fetch Reported Locations from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReportedLocations(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      {position ? (
        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Click Handler for Selecting Location */}
          <MapClickHandler 
            setLocation={setLocation} 
            setLatitude={setLatitude} 
            setLongitude={setLongitude} 
            setSelectedPosition={setSelectedPosition} 
          />

          {/* Current User Location Marker */}
          {position && (
            <Marker position={position} icon={userLocationIcon}>
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {/* Selected Position Marker (Only if user clicks on map) */}
          {selectedPosition && selectedPosition.lat && selectedPosition.lng && (
            <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
              <Popup>{selectedPosition.name}</Popup>
            </Marker>
          )}

          {/* Submitted Location Marker (Only if exists) */}
          {submittedLocation && submittedLocation.lat && submittedLocation.lng && (
            <Marker position={[submittedLocation.lat, submittedLocation.lng]} icon={reportedLocationIcon}>
              <Popup>Reported Location</Popup>
            </Marker>
          )}

          {/* Reported Locations Markers (Fetched from Firestore) */}
          {Array.isArray(reportedLocations) && reportedLocations.length > 0 &&
            reportedLocations.map((report) => (
              report.latitude && report.longitude && (
                <Marker 
                  key={report.id} 
                  position={[report.latitude, report.longitude]} 
                  icon={reportedLocationIcon}
                >
                  <Popup>
                    <strong>{report.issueType}</strong> <br />
                    Severity: {report.severity} <br />
                    Location: {report.location} <br />
                    Description: {report.description} <br />
                    {report.imageBase64 && (
                      <img src={report.imageBase64} alt="Reported Issue" width="100" />
                    )}
                  </Popup>
                </Marker>
              )
            ))
          }
        </MapContainer>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default MapComponent;
