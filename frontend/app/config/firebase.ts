import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcSlLnjGY76HELqTyinDUgKTFdfPg5tws",
  authDomain: "cookie-87a30.firebaseapp.com",
  projectId: "cookie-87a30",
  storageBucket: "cookie-87a30.firebasestorage.app",
  messagingSenderId: "68219049943",
  appId: "1:68219049943:web:f9f3bbc5de4ffceb1b1d92",
  measurementId: "G-9XSR83ZB7Z"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const gitProvider = new GithubAuthProvider();

export default app;
