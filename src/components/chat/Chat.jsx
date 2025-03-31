// import { useEffect, useRef, useState } from "react";
// import "./chat.css";
// import EmojiPicker from "emoji-picker-react";
// import {
//   arrayUnion,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { useChatStore } from "../../lib/chatStore";
// import { useUserStore } from "../../lib/userStore";
// import upload from "../../lib/upload";
// import { format } from "timeago.js";

// const Chat = () => {
//   const [chat, setChat] = useState();
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");
//   const [img, setImg] = useState({
//     file: null,
//     url: "",
//   });

//   const { currentUser } = useUserStore();
//   const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
//     useChatStore();

//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat.messages]);

//   useEffect(() => {
//     const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
//       setChat(res.data());
//     });

//     return () => {
//       unSub();
//     };
//   }, [chatId]);

//   const handleEmoji = (e) => {
//     setText((prev) => prev + e.emoji);
//     setOpen(false);
//   };

//   const handleImg = (e) => {
//     if (e.target.files[0]) {
//       setImg({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0]),
//       });
//     }
//   };

//   const handleSend = async () => {
//     if (text === "") return;

//     let imgUrl = null;

//     try {
//       if (img.file) {
//         imgUrl = await upload(img.file);
//       }

//       await updateDoc(doc(db, "chats", chatId), {
//         messages: arrayUnion({
//           senderId: currentUser.id,
//           text,
//           createdAt: new Date(),
//           ...(imgUrl && { img: imgUrl }),
//         }),
//       });

//       const userIDs = [currentUser.id, user.id];

//       userIDs.forEach(async (id) => {
//         const userChatsRef = doc(db, "userchats", id);
//         const userChatsSnapshot = await getDoc(userChatsRef);

//         if (userChatsSnapshot.exists()) {
//           const userChatsData = userChatsSnapshot.data();

//           const chatIndex = userChatsData.chats.findIndex(
//             (c) => c.chatId === chatId
//           );

//           userChatsData.chats[chatIndex].lastMessage = text;
//           userChatsData.chats[chatIndex].isSeen =
//             id === currentUser.id ? true : false;
//           userChatsData.chats[chatIndex].updatedAt = Date.now();

//           await updateDoc(userChatsRef, {
//             chats: userChatsData.chats,
//           });
//         }
//       });
//     } catch (err) {
//       console.log(err);
//     } finally{
//     setImg({
//       file: null,
//       url: "",
//     });

//     setText("");
//     }
//   };

//   return (
//     <div className="chat">
//       <div className="top">
//         <div className="user">
//           <img src={user?.avatar || "./avatar.png"} alt="" />
//           <div className="texts">
//             <span>{user?.username}</span>
//             <p>Lorem ipsum dolor, sit amet.</p>
//           </div>
//         </div>
//         <div className="icons">
//           <img src="./phone.png" alt="" />
//           <img src="./video.png" alt="" />
//           <img src="./info.png" alt="" />
//         </div>
//       </div>
//       <div className="center">
//         {chat?.messages?.map((message) => (
//           <div
//             className={
//               message.senderId === currentUser?.id ? "message own" : "message"
//             }
//             key={message?.createAt}
//           >
//             <div className="texts">
//               {message.img && <img src={message.img} alt="" />}
//               <p>{message.text}</p>
//               <span>{format(message.createdAt.toDate())}</span>
//             </div>
//           </div>
//         ))}
//         {img.url && (
//           <div className="message own">
//             <div className="texts">
//               <img src={img.url} alt="" />
//             </div>
//           </div>
//         )}
//         <div ref={endRef}></div>
//       </div>
//       <div className="bottom">
//         <div className="icons">
//           <label htmlFor="file">
//             <img src="./img.png" alt="" />
//           </label>
//           <input
//             type="file"
//             id="file"
//             style={{ display: "none" }}
//             onChange={handleImg}
//           />
//           <img src="./camera.png" alt="" />
//           <img src="./mic.png" alt="" />
//         </div>
//         <input
//           type="text"
//           placeholder={
//             isCurrentUserBlocked || isReceiverBlocked
//               ? "You cannot send a message"
//               : "Type a message..."
//           }
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         />
//         <div className="emoji">
//           <img
//             src="./emoji.png"
//             alt=""
//             onClick={() => setOpen((prev) => !prev)}
//           />
//           <div className="picker">
//             <EmojiPicker open={open} onEmojiClick={handleEmoji} />
//           </div>
//         </div>
//         <button
//           className="sendButton"
//           onClick={handleSend}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;


import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { supabase } from "../../lib/supabase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat?.messages]);


  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      if (!chatId) return;
    
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true }); // Ensure messages are in correct order
    
      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setChat({ messages: data }); // Ensure messages are set in state
      }
    };    
    
      fetchChat(); // Fetch existing messages
    
      const subscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
          (payload) => {
            console.log("New message received:", payload.new); // Debugging
            setChat((prev) => ({
              messages: [...(prev?.messages || []), payload.new], // Add new message to state
            }));
          }
        )
        .subscribe();
    
      return () => {
        supabase.removeChannel(subscription);
      };
    }, [chatId]);
    
    

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text.trim() === "") return;
  
    let imgUrl = null;
  
    try {
      if (img.file) {
        imgUrl = await upload(img.file); // Upload image and get URL
      }
  
      const newMessage = {
        chat_id: chatId,
        sender_id: currentUser.id,
        text,
        img: imgUrl,
        created_at: new Date().toISOString(),
      };
  
      // Insert into messages table
      await supabase.from("messages").insert([newMessage]);
  
      // Update last message for both users in `user_chats`
      await Promise.all([
        supabase
          .from("user_chats")
          .update({ last_message: text, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("chat_id", chatId),
  
        supabase
          .from("user_chats")
          .update({ last_message: text, updated_at: new Date().toISOString() })
          .eq("user_id", currentUser.id)
          .eq("chat_id", chatId),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };
  

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Online status or last seen</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="Phone" />
          <img src="./video.png" alt="Video Call" />
          <img src="./info.png" alt="Info" />
        </div>
      </div>

      <div className="center">
  {chat?.messages?.map((message, index) => (
    <div
      className={
        message.sender_id === currentUser?.id ? "message own" : "message"
      }
      key={message.id || index} // Ensure key is unique
    >
      <div className="texts">
        {message.img && <img src={message.img} alt="Attachment" />}
        <p>{message.text}</p>
        <span>{format(message.created_at)}</span>
      </div>
    </div>
  ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="Attach" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="Camera" />
          <img src="./mic.png" alt="Mic" />
        </div>

        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className="emoji">
          <img src="./emoji.png" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
