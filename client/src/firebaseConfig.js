import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyC41Ou0G1p3RBwPkKpqclM6b5CFuJTf2RU",
  authDomain: "road-reporter-a3c35.firebaseapp.com",
  projectId: "road-reporter-a3c35",
  storageBucket: "road-reporter-a3c35.firebasestorage.app",
  messagingSenderId: "248738070506",
  appId: "1:248738070506:web:f5387cb6e033c82eec3c93",
  measurementId: "G-F0N97P18ZS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

export { db, auth, storage }; // Export storage and other services
