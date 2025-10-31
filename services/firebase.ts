// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwK7oxydDBcN4aqkJybvyo6gVrnupogTc",
  authDomain: "margeitpro-ee747.firebaseapp.com",
  projectId: "margeitpro-ee747",
  storageBucket: "margeitpro-ee747.firebasestorage.app",
  messagingSenderId: "873028272369",
  appId: "1:873028272369:web:9ee88b8c3355efccb16950",
  measurementId: "G-V0C77B6LPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll use throughout your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Add localhost and local IP to authorized domains for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    client_id: '873028272369-ibukapf98tkak35gb2eigbsjt0s35van.apps.googleusercontent.com'
  });
}
