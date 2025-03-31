// import { useEffect, useState } from "react";
// import "./chatList.css";
// import AddUser from "./addUser/addUser";
// import { useUserStore } from "../../../lib/userStore";
// import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { useChatStore } from "../../../lib/chatStore";

// const ChatList = () => {
//   const [chats, setChats] = useState([]);
//   const [addMode, setAddMode] = useState(false);
//   const [input, setInput] = useState("");

//   const { currentUser } = useUserStore();
//   const { chatId, changeChat } = useChatStore();

//   useEffect(() => {
//     const unSub = onSnapshot(
//       doc(db, "userchats", currentUser.id),
//       async (res) => {
//         const items = res.data().chats;

//         const promises = items.map(async (item) => {
//           const userDocRef = doc(db, "users", item.receiverId);
//           const userDocSnap = await getDoc(userDocRef);

//           const user = userDocSnap.data();

//           return { ...item, user };
//         });

//         const chatData = await Promise.all(promises);

//         setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
//       }
//     );

//     return () => {
//       unSub();
//     };
//   }, [currentUser.id]);

//   const handleSelect = async (chat) => {
//     const userChats = chats.map((item) => {
//       const { user, ...rest } = item;
//       return rest;
//     });

//     const chatIndex = userChats.findIndex(
//       (item) => item.chatId === chat.chatId
//     );

//     userChats[chatIndex].isSeen = true;

//     const userChatsRef = doc(db, "userchats", currentUser.id);

//     try {
//       await updateDoc(userChatsRef, {
//         chats: userChats,
//       });
//       changeChat(chat.chatId, chat.user);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const filteredChats = chats.filter((c) =>
//     c.user.username.toLowerCase().includes(input.toLowerCase())
//   );

//   return (
//     <div className="chatList">
//       <div className="search">
//         <div className="searchBar">
//           <img src="./search.png" alt="" />
//           <input
//             type="text"
//             placeholder="Search"
//             onChange={(e) => setInput(e.target.value)}
//           />
//         </div>
//         <img
//           src={addMode ? "./minus.png" : "./plus.png"}
//           alt=""
//           className="add"
//           onClick={() => setAddMode((prev) => !prev)}
//         />
//       </div>
//       {filteredChats.map((chat) => (
//         <div
//           className="item"
//           key={chat.chatId}
//           onClick={() => handleSelect(chat)}
//           style={{
//             backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
//           }}
//         >
//           <img
//             src={
//               chat.user.blocked.includes(currentUser.id)
//                 ? "./avatar.png"
//                 : chat.user.avatar || "./avatar.png"
//             }
//             alt=""
//           />
//           <div className="texts">
//             <span>
//               {chat.user.blocked.includes(currentUser.id)
//                 ? "User"
//                 : chat.user.username}
//             </span>
//             <p>{chat.lastMessage}</p>
//           </div>
//         </div>
//       ))}

//       {addMode && <AddUser />}
//     </div>
//   );
// };

// export default ChatList;


import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { supabase } from "../../../lib/supabase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const fetchChats = async () => {
      const { data: chatItems, error } = await supabase
        .from("user_chats")
        .select("*")
        .eq("user_id", currentUser.id);

      if (error) {
        console.error(error);
        return;
      }

      const chatData = await Promise.all(
        chatItems.map(async (item) => {
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("username, avatar, blocked")
            .eq("id", item.receiver_id)
            .single();

          if (userError) {
            console.error(userError);
            return item;
          }

          return { ...item, user };
        })
      );

      setChats(chatData.sort((a, b) => b.updated_at - a.updated_at));
    };

    fetchChats();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const updatedChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = updatedChats.findIndex(
      (item) => item.chat_id === chat.chat_id
    );

    updatedChats[chatIndex].is_seen = true;

    try {
      await supabase
        .from("user_chats")
        .update({ is_seen: true })
        .eq("chat_id", chat.chat_id)
        .eq("user_id", currentUser.id);

      changeChat(chat.chat_id, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chat_id}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.is_seen ? "transparent" : "#5183fe" }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.last_message}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser refreshChats={fetchChats} />}

    </div>
  );
};

export default ChatList;
