// firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";

const serviceAccount = require(path.resolve("./serviceAccountKey.json"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
