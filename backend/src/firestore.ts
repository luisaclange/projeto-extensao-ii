import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT não está definida");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
