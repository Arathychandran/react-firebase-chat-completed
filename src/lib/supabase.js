// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: "reactchat-8953e.firebaseapp.com",
//   projectId: "reactchat-8953e",
//   storageBucket: "reactchat-8953e.appspot.com",
//   messagingSenderId: "989490756392",
//   appId: "1:989490756392:web:9e54e92c7b39c531b82e1d"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth()
// export const db = getFirestore()
// export const storage = getStorage()

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ozhrjiglxmktxyizfnjh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHJqaWdseG1rdHh5aXpmbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Nzg0MTksImV4cCI6MjA1NzM1NDQxOX0.S7jiqZ-MBIm81_1PVslS-aizkdUu4WX-Yot4ORwTpVk"; // 🔹 Replace with your Supabase API key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);