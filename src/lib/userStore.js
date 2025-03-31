// import { doc, getDoc } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "./firebase";

// export const useUserStore = create((set) => ({
//   currentUser: null,
//   isLoading: true,
//   fetchUserInfo: async (uid) => {
//     if (!uid) return set({ currentUser: null, isLoading: false });

//     try {
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         set({ currentUser: docSnap.data(), isLoading: false });
//       } else {
//         set({ currentUser: null, isLoading: false });
//       }
//     } catch (err) {
//       console.log(err);
//       return set({ currentUser: null, isLoading: false });
//     }
//   },
// }));


import { create } from "zustand";
import { supabase } from "./supabase";

export const useUserStore = create((set) => ({
  currentUser: null,
  userData: null,
  isLoading: true,

  setUser: (user) => set({ currentUser: user, isLoading: false }),
  setUserData: (data) => set({ userData: data }),

  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, userData: null, isLoading: false });
      return;
    }
    
    console.log("Fetching user info for UID:", uid);

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();
      if (error) throw error;
      
      console.log("User data fetched:", data);
      set({ userData: data, isLoading: false });
    } catch (err) {
      console.error("Error fetching user data:", err);
      set({ userData: null, isLoading: false });
    }
  },

  listenToAuthChanges: () => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (session?.user) {
        set({ currentUser: session.user });
        await useUserStore.getState().fetchUserInfo(session.user.id);
      } else {
        set({ currentUser: null, userData: null, isLoading: false });
      }
    });
    return authListener;
  },
}));