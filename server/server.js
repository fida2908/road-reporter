const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
require('dotenv').config();

// Firebase Admin Initialization
const serviceAccount = require('./firebase-config.json'); // Download your Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "road-reporter-a3c35.appspot.com"
});
const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Save pothole report
app.post('/report', async (req, res) => {
  try {
    const { location, severity, imageUrl } = req.body;
    await db.collection('reports').add({ location, severity, imageUrl, timestamp: new Date() });
    res.status(200).json({ message: 'Report added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reports
app.get('/reports', async (req, res) => {
  try {
    const reports = await db.collection('reports').get();
    const data = reports.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cloud Function for Deployment
exports.api = functions.https.onRequest(app);

app.listen(5000, () => console.log('Server running on port 5000'));
