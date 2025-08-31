// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "lets-cook-curry-xrwg7",
  "appId": "1:480933950760:web:6077f768b27a45efea8c1d",
  "storageBucket": "lets-cook-curry-xrwg7.firebasestorage.app",
  "apiKey": "AIzaSyDvTQfSl1TdPi38Qdx_l4yyrSK8SJiylnM",
  "authDomain": "lets-cook-curry-xrwg7.firebaseapp.com",
  "measurementId": "G-XZ5L0Q50Z2",
  "messagingSenderId": "480933950760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const GTM_ID = firebaseConfig.measurementId;

export { app, db };
