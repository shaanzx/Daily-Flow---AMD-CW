import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDBn-mC43ixTKe2tPZ3H0FL23sv4O1Qn1o",
  authDomain: "dailyflow-9f0dd.firebaseapp.com",
  projectId: "dailyflow-9f0dd",
  storageBucket: "dailyflow-9f0dd.firebasestorage.app",
  messagingSenderId: "306144708524",
  appId: "1:306144708524:web:7c8f81b0c57d3cf5e9dc09",
  measurementId: "G-C98TDYCLCK"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)