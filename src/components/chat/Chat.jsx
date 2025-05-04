// import { useEffect, useRef, useState } from "react";
// import "./chat.css";
// import EmojiPicker from "emoji-picker-react";
// import { supabase } from "../../lib/supabase";
// import { useChatStore } from "../../lib/chatStore";
// import { useUserStore } from "../../lib/userStore";
// import upload from "../../lib/upload";
// import { format } from "timeago.js";

// const Chat = () => {
//   const [islWorker, setIslWorker] = useState(null);
//   const [text, setText] = useState("");
//   const [img, setImg] = useState({ file: null, url: "" });
//   const [open, setOpen] = useState(false);
//   const [isProcessingISL, setIsProcessingISL] = useState(false);

//   const endRef = useRef();

//   const { chat, user } = useChatStore();
//   const { currentUser, isCurrentUserBlocked, isReceiverBlocked } = useUserStore();

//   const chatId = chat?.chat_id;

//   useEffect(() => {
//     const worker = new Worker(new URL('../../workers/islWorker.js', import.meta.url));
//     setIslWorker(worker);

//     return () => worker.terminate();
//   }, []);

//   const convertToISL = async (text) => {
//     return new Promise((resolve) => {
//       if (!islWorker) return resolve({ videoUrl: null, emotion: null });

//       setIsProcessingISL(true);
//       islWorker.onmessage = (e) => {
//         setIsProcessingISL(false);
//         resolve(e.data);
//       };
//       islWorker.postMessage({ text });
//     });
//   };

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
//     if (text.trim() === "" || isProcessingISL) return;

//     let imgUrl = null;
//     let islResult = { videoUrl: null, emotion: null };

//     try {
//       if (img.file) {
//         imgUrl = await upload(img.file);
//       }

//       if (text.trim()) {
//         islResult = await convertToISL(text);
//       }

//       const newMessage = {
//         chat_id: chatId,
//         sender_id: currentUser.id,
//         text,
//         img: imgUrl,
//         isl_video: islResult.videoUrl,
//         emotion: islResult.emotion,
//         created_at: new Date().toISOString(),
//       };

//       await supabase.from("messages").insert([newMessage]);

//       await Promise.all([
//         supabase
//           .from("user_chats")
//           .update({
//             last_message: text,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("user_id", user.id)
//           .eq("chat_id", chatId),
//         supabase
//           .from("user_chats")
//           .update({
//             last_message: text,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("user_id", currentUser.id)
//           .eq("chat_id", chatId),
//       ]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setImg({ file: null, url: "" });
//       setText("");
//     }
//   };

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages]);

//   return (
//     <div className="chat">
//       <div className="top">
//         <div className="user">
//           <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
//           <div className="texts">
//             <span>{user?.username}</span>
//             <p>Online status or last seen</p>
//           </div>
//         </div>
//         <div className="icons">
//           <img src="./phone.png" alt="Phone" />
//           <img src="./video.png" alt="Video Call" />
//           <img src="./info.png" alt="Info" />
//         </div>
//       </div>

//       <div className="center">
//         {chat?.messages?.map((message, index) => (
//           <div
//             className={
//               message.sender_id === currentUser?.id ? "message own" : "message"
//             }
//             key={message.id || index}
//           >
//             <div className="texts">
//               {message.img && <img src={message.img} alt="Attachment" />}
//               <p>{message.text}</p>
//               {message.emotion && (
//                 <div className="emotion-tag">Emotion: {message.emotion}</div>
//               )}
//               {message.isl_video && (
//                 <div className="isl-video">
//                   <video controls width="240">
//                     <source src={message.isl_video} type="video/mp4" />
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               )}
//               <span>{format(message.created_at)}</span>
//             </div>
//           </div>
//         ))}

//         {img.url && (
//           <div className="message own">
//             <div className="texts">
//               <img src={img.url} alt="Preview" />
//             </div>
//           </div>
//         )}

//         {isProcessingISL && (
//           <div className="processing-indicator">
//             Converting text to Indian Sign Language...
//           </div>
//         )}

//         <div ref={endRef}></div>
//       </div>

//       <div className="bottom">
//         <div className="icons">
//           <label htmlFor="file">
//             <img src="./img.png" alt="Attach" />
//           </label>
//           <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
//           <img src="./camera.png" alt="Camera" />
//           <img src="./mic.png" alt="Mic" />
//         </div>

//         <input
//           type="text"
//           placeholder={
//             isCurrentUserBlocked || isReceiverBlocked
//               ? "You cannot send a message"
//               : isProcessingISL
//               ? "Converting to ISL..."
//               : "Type a message..."
//           }
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           disabled={isCurrentUserBlocked || isReceiverBlocked || isProcessingISL}
//         />

//         <div className="emoji">
//           <img src="./emoji.png" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
//           {open && (
//             <div className="picker">
//               <EmojiPicker onEmojiClick={handleEmoji} />
//             </div>
//           )}
//         </div>

//         <button
//           className="sendButton"
//           onClick={handleSend}
//           disabled={
//             isCurrentUserBlocked ||
//             isReceiverBlocked ||
//             isProcessingISL ||
//             !text.trim()
//           }
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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
}

const Chat = () => {
  const [chat, setChat] = useState({ messages: [] });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (!error) setChat({ messages: data });
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime_chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChat((prev) => ({ messages: [...prev.messages, payload.new] }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
    if (text.trim() === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await supabase.from("messages").insert([
        {
          chat_id: chatId,
          sender_id: currentUser.id,
          text: text,
          img: imgUrl,
        },
      ]);

      // Update last message
      const { data: chatsData, error } = await supabase
        .from("user_chats")
        .select("*")
        .contains("chat_ids", [chatId]);

      if (!error && chatsData.length > 0) {
        for (const chat of chatsData) {
          const chats = chat.chats.map((c) =>
            c.chat_id === chatId
              ? {
                  ...c,
                  lastMessage: text,
                  isSeen: c.user_id === currentUser.id,
                  updatedAt: new Date().toISOString(),
                }
              : c
          );

          await supabase
            .from("user_chats")
            .update({ chats })
            .eq("id", chat.id);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };

  const handleConvert = () => {
    console.log("Convert button clicked with text:", text);
    // You can trigger ISL video or emotion-based action here
  };

  const handleMicClick = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Say hello 👋</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="call" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="info" />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.sender_id === currentUser?.id ? "message own" : "message"}
            key={message.id}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="media" />}
              <p>{message.text}</p>
              <span>{format(new Date(message.created_at))}</span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="upload" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="camera" />
          <img src="./mic.png" alt="mic" onClick={handleMicClick} />
        </div>

        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className="emoji">
          <img src="./emoji.png" alt="emoji" onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>

        <div className="button-group">
          <button
            className="sendButton"
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            Send
          </button>
          <button
            className="sendButton"
            onClick={handleConvert}
            disabled={!text || isCurrentUserBlocked || isReceiverBlocked}
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
