// src/lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔧 Configuración de tu proyecto (copiada de la consola Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBP_IYGfqfUQ0pw4NErRM3cMbIM8jGyIjNE",
  authDomain: "studio-9092569756-2645c.firebaseapp.com",
  projectId: "studio-9092569756-2645c",
  storageBucket: "studio-9092569756-2645c.appspot.com",
  messagingSenderId: "165898989815",
  appId: "1:165898989815:web:c4349286f5d1705fa0f12a"
};

// Inicializa Firebase y exporta Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
