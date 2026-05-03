import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//  Your config (already correct)
const firebaseConfig = {
  apiKey: "AIzaSyD7yJmNFdrQOQYW7PE7c2VUJWHN-YDL_Jk",
  authDomain: "billing-system-9fe15.firebaseapp.com",
  projectId: "billing-system-9fe15",
  storageBucket: "billing-system-9fe15.firebasestorage.app",
  messagingSenderId: "632746845502",
  appId: "1:632746845502:web:c576481af82f5bf1ca386f",
};

//  Initialize app
const app = initializeApp(firebaseConfig);

//  AUTH (THIS WAS MISSING)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();