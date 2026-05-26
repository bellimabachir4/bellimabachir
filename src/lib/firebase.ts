import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isFirebaseAvailableFlag = false;

try {
  // Check if firebase config is populated with real values
  if (
    firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== ""
  ) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Explicitly check for firestoreDatabaseId or fall back gracefully
    const dbId = (firebaseConfig as any).firestoreDatabaseId || undefined;
    
    dbInstance = getFirestore(app, dbId);
    authInstance = getAuth(app);
    isFirebaseAvailableFlag = true;
    console.log("🔥 Firebase Auth and Firestore successfully initialized!");
  } else {
    console.log("ℹ️ Firebase configuration is incomplete. Running in Local Simulation Mode.");
  }
} catch (error) {
  console.warn("⚠️ Error initializing Firebase. Falling back to Local Simulation Mode:", error);
}

export const db: Firestore | null = dbInstance;
export const auth: Auth | null = authInstance;
export const isFirebaseAvailable = () => isFirebaseAvailableFlag;
