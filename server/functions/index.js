const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: ['https://your-frontend-domain.com'] })); // Change the origin as needed
app.use(express.json());

// Root route to check API status
app.get('/', (req, res) => {
  res.send('Combined API & Backend is running');
});

// Report submission route
app.post('/report', async (req, res) => {
  try {
    const { lat, lng, severity, imageUrl } = req.body;

    // Validate request data
    if (!lat || !lng || !severity || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add report to Firestore
    const docRef = await db.collection('reports').add({
      lat,
      lng,
      severity,
      imageUrl,
      timestamp: FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Report added', id: docRef.id });
  } catch (error) {
    functions.logger.error('Error adding report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
