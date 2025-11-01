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

// Configure auth settings for development
if (typeof window !== 'undefined') {
  // Enable auth emulator for localhost development if needed
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.startsWith('192.168.');
  
  if (isLocalhost) {
    console.log('Running on localhost - Firebase auth configured for development');
  }
}

// Configure Google provider for development
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
