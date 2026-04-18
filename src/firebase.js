import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDsedjbzg3JeXw_T8Hq36Vo255CnO7QM5g",
    authDomain: "roommate-matching-app-2c45b.firebaseapp.com",
    projectId: "roommate-matching-app-2c45b",
    storageBucket: "roommate-matching-app-2c45b.firebasestorage.app",
    messagingSenderId: "801386552897",
    appId: "1:801386552897:web:420caf6563a0f0bc39b0c0",
    measurementId: "G-NFCDG70BZ5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };