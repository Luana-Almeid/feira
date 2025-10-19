
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7ufar5hd7ReOxJNHxjMT2WVkjbbwEATk",
  authDomain: "excelenciafrutas.firebaseapp.com",
  projectId: "excelenciafrutas",
  storageBucket: "excelenciafrutas.firebasestorage.app",
  messagingSenderId: "1024009969013",
  appId: "1:1024009969013:web:9894737ca65bb0a0a9c73c",
  measurementId: "G-HBWY98G4JM"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);


export { app, auth, db };
