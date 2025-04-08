import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAm5bMf_TjAZvqyQtNheQC0lluj_XIKwtk",
  authDomain: "nano-2f9ff.firebaseapp.com",
  projectId: "nano-2f9ff",
  storageBucket: "nano-2f9ff.appspot.com",
  messagingSenderId: "646724577017",
  appId: "1:646724577017:web:ea03d573ca72bde9972428",
  databaseURL: "https://nano-2f9ff-default-rtdb.firebaseio.com",
};

// Inicializa Firebase solo si no ha sido inicializado
const app = initializeApp(firebaseConfig);

// Exporta la base de datos y Firestore
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export { app, db, rtdb, auth };
