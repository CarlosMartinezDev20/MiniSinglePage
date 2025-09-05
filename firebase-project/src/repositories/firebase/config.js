// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAz0L-R__0OTwfDW37qq-PaCGQGVZwCXnY",
    authDomain: "authentificacion-app.firebaseapp.com",
    projectId: "authentificacion-app",
    storageBucket: "authentificacion-app.firebasestorage.app",
    messagingSenderId: "981115803058",
    appId: "1:981115803058:web:2a987084719af4d859c0ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);