// Import Firebase scripts (add these to your HTML first)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your Firebase configuration (PASTE YOUR CONFIG HERE from Step 5)
// Import the functions you need from the SDKs you need


  const firebaseConfig = {
    apiKey: "AIzaSyDhYfsYEJGaBvSRsY1bbujHCyKLGXH1W28",
    authDomain: "mjs-fehimaa.firebaseapp.com",
    projectId: "mjs-fehimaa",
    storageBucket: "mjs-fehimaa.firebasestorage.app",
    messagingSenderId: "509657178337",
    appId: "1:509657178337:web:e0e6aa686b5ee4697157a0",
    measurementId: "G-BXD5Q1MY6V"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { auth, db, storage };