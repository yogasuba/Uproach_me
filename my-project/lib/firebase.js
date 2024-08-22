// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAUfwSMMY_mUaEzf2EP4wqqyKLtOq5NLAQ",
    authDomain: "",
    projectId: "uproach-829c5",
    storageBucket: "uproach-829c5.appspot.com",
    messagingSenderId: "408753475305",
    appId: "1:408753475305:web:70ae0e540ca24b5cf3ea78"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
