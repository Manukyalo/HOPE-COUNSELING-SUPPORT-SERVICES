import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJzHl4l9arfmraqyaOU0LdVFG-a3gG6fM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hope-counseling-cfea1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hope-counseling-cfea1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hope-counseling-cfea1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "769255969375",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:769255969375:web:18546cd0c655d04c70c1ea",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3BQXLWRTDW",
};

// Singleton initialization
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Enable offline persistence in browser
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn("Firestore offline persistence: multiple tabs open.");
    } else if (err.code === "unimplemented") {
      // The current browser does not support persistence.
      console.warn("Firestore offline persistence not supported by this browser.");
    }
  });
}

export { app, auth, db };
