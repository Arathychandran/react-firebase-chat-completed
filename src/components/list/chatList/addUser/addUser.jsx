// import "./addUser.css";
// import { db } from "../../../../lib/firebase";
// import {
//   arrayUnion,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { useState } from "react";
// import { useUserStore } from "../../../../lib/userStore";

// const AddUser = () => {
//   const [user, setUser] = useState(null);

//   const { currentUser } = useUserStore();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const username = formData.get("username");

//     try {
//       const userRef = collection(db, "users");

//       const q = query(userRef, where("username", "==", username));

//       const querySnapShot = await getDocs(q);

//       if (!querySnapShot.empty) {
//         setUser(querySnapShot.docs[0].data());
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleAdd = async () => {
//     const chatRef = collection(db, "chats");
//     const userChatsRef = collection(db, "userchats");

//     try {
//       const newChatRef = doc(chatRef);

//       await setDoc(newChatRef, {
//         createdAt: serverTimestamp(),
//         messages: [],
//       });

//       await updateDoc(doc(userChatsRef, user.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: currentUser.id,
//           updatedAt: Date.now(),
//         }),
//       });

//       await updateDoc(doc(userChatsRef, currentUser.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: user.id,
//           updatedAt: Date.now(),
//         }),
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="addUser">
//       <form onSubmit={handleSearch}>
//         <input type="text" placeholder="Username" name="username" />
//         <button>Search</button>
//       </form>
//       {user && (
//         <div className="user">
//           <div className="detail">
//             <img src={user.avatar || "./avatar.png"} alt="" />
//             <span>{user.username}</span>
//           </div>
//           <button onClick={handleAdd}>Add User</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddUser;

import "./addUser.css";
import { supabase } from "../../../../lib/supabase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  // Handle searching for a user
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
  
    try {
      console.log("Searching for username:", username);
  
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .limit(1) // Ensure only one user is fetched
        .single(); // Enforce fetching a single user
  
      if (error) {
        if (error.code === "PGRST116") {
          console.log("No user found with this username.");
        }
        throw error;
      }
  
      console.log("User found:", data);
      setUser(data);
    } catch (err) {
      console.error("Error searching user:", err);
      setUser(null);
    }
  };
  

  // Handle adding a user to the chat list
  const handleAdd = async () => {
    if (!user) {
      console.error("No user selected to add.");
      return;
    }
  
    try {
      console.log("Checking if users exist...");
  
      // Check if the searched user exists in 'users' table
      const { data: userExists, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();
  
      // Check if the current logged-in user exists in 'users' table
      const { data: receiverExists, error: receiverError } = await supabase
        .from("users")
        .select("id")
        .eq("id", currentUser.id)
        .single();
  
      if (userError || !userExists) {
        console.error("User does not exist in users table:", userError);
        return;
      }
      if (receiverError || !receiverExists) {
        console.error("Receiver does not exist in users table:", receiverError);
        return;
      }
  
      console.log("Both users exist, creating a chat...");

      console.log("User ID to insert:", user.id);
      console.log("Receiver ID (Current User):", currentUser.id);

  
      // Create a new chat entry
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .insert([{ created_at: new Date().toISOString(), messages: [] }])
        .select()
        .single();
  
      if (chatError) throw chatError;
  
      console.log("Chat created successfully:", chatData);
  
      const chatId = chatData.id;
  
      // Insert chat references for both users
      const { error: userChatError1 } = await supabase.from("user_chats").insert([
        {
          user_id: user.id,
          chat_id: chatId,
          last_message: "",
          receiver_id: currentUser.id,
          updated_at: new Date().toISOString(),
        },
      ]);
  
      const { error: userChatError2 } = await supabase.from("user_chats").insert([
        {
          user_id: currentUser.id,
          chat_id: chatId,
          last_message: "",
          receiver_id: user.id,
          updated_at: new Date().toISOString(),
        },
      ]);
  
      if (userChatError1 || userChatError2) {
        throw userChatError1 || userChatError2;
      }
  
      console.log("User added to chat successfully!");
      refreshChats();
  
      // Clear user state after adding to prevent duplicate addition
      setUser(null);
    } catch (err) {
      console.error("Error adding user to chat:", err);
    }
  };
  

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
