// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyBQGu4dc29UlI0OmHshpptfrtls6DA-YRI",
  authDomain: "omrisite-5783a.firebaseapp.com",
  projectId: "omrisite-5783a",
  storageBucket: "omrisite-5783a.appspot.com",
  messagingSenderId: "1079739338434",
  appId: "1:1079739338434:web:ece3aec7c343d3592fb55b",
  measurementId: "G-ECV3VDJJ3K"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const authInstance = getAuth(firebaseApp);
const functionsInstance = getFunctions(firebaseApp);
export { firestore , authInstance ,functionsInstance,firebaseApp}; // Correct export statement
