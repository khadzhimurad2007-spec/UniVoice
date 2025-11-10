// src/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";

// Конфигурация Firebase из .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: "univoice-cef11.appspot.com",
    messagingSenderId: "515262190877",
    appId: "1:515262190877:web:613879ec102583ea5e7df4",
    measurementId: "G-TXKV89532Z",
};

// Инициализация приложения
const app = initializeApp(firebaseConfig);

// Экспорт сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth провайдер
const provider = new GoogleAuthProvider();

// Функции для входа/выхода
export async function loginWithGoogle() {
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Ошибка входа через Google:", error);
        throw error;
    }
}

export async function logout() {
    try {
        return await signOut(auth);
    } catch (error) {
        console.error("Ошибка выхода:", error);
        throw error;
    }
}

// Удобные реэкспорты для Firestore
export { collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot };
