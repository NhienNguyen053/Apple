import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDU3c2a6SI6kw5h3ENpfnKZ7tGo_QWmYqA",
  authDomain: "apple-12071.firebaseapp.com",
  projectId: "apple-12071",
  storageBucket: "apple-12071.appspot.com",
  messagingSenderId: "985981827833",
  appId: "1:985981827833:web:4a3fd644063d49dfb38028",
  measurementId: "G-SGLL54DK26"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);