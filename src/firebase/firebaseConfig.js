// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARWXVVNhRNDmvdbRb5YBoO3fhwaj5Gqzw",
  authDomain: "archery-scoresheet-fbe22.firebaseapp.com",
  databaseURL: "https://archery-scoresheet-fbe22-default-rtdb.firebaseio.com",
  projectId: "archery-scoresheet-fbe22",
  storageBucket: "archery-scoresheet-fbe22.appspot.com",
  messagingSenderId: "1052685701186",
  appId: "1:1052685701186:web:349a8e5ea1d5593a4f1ddb",
  measurementId: "G-3Y86RTL1B4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default app;
