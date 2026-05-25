import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDM0oVRLBb6SLUvdLsqewo7YBiH2KZsnn0",
  authDomain: "expo-nosql-futurama.firebaseapp.com",
  projectId: "expo-nosql-futurama",
  storageBucket: "expo-nosql-futurama.firebasestorage.app",
  messagingSenderId: "100230186067",
  appId: "1:100230186067:web:d8baba499126b3f705b2a6",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 


export { auth, db };