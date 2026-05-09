import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCjwvhUkUiFSmcLj7bCVkRmFGlTKcRrT9c",
  authDomain: "crud-3f30d.firebaseapp.com",
  projectId: "crud-3f30d",
  storageBucket: "crud-3f30d.firebasestorage.app",
  messagingSenderId: "17943859340",
  appId: "1:17943859340:web:6c741f8de4a062a240eba9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 


export { auth, db };