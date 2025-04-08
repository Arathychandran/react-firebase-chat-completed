import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { supabase } from "../../lib/supabase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const [islWorker, setIslWorker] = useState(null);
  
  useEffect(() => {
    const worker = new Worker(new URL('../../workers/islWorker.js', import.meta.url));
    setIslWorker(worker);
    
    return () => worker.terminate();
  }, []);

  const convertToISL = async (text) => {
    return new Promise((resolve) => {
      islWorker.onmessage = (e) => resolve(e.data);
      islWorker.postMessage({ text });
    });
  };

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
  if (text.trim() === "" || isProcessingISL) return;

  let imgUrl = null;
  let islResult = { videoUrl: null, emotion: null };

  try {
    // Upload image if present
    if (img.file) {
      imgUrl = await upload(img.file);
    }
    
    // Convert text to ISL if not empty
    if (text.trim()) {
      islResult = await convertToISL(text);
    }

    const newMessage = {
      chat_id: chatId,
      sender_id: currentUser.id,
      text,
      img: imgUrl,
      isl_video: islResult.videoUrl,
      emotion: islResult.emotion,
      created_at: new Date().toISOString(),
    };

    // Insert into messages table
    await supabase.from("messages").insert([newMessage]);

    // Update last message for both users
    await Promise.all([
      supabase
        .from("user_chats")
        .update({ 
          last_message: text, 
          updated_at: new Date().toISOString() 
        })
        .eq("user_id", user.id)
        .eq("chat_id", chatId),
      supabase
        .from("user_chats")
        .update({ 
          last_message: text, 
          updated_at: new Date().toISOString() 
        })
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
            key={message.id || index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="Attachment" />}
              <p>{message.text}</p>
              {message.emotion && (
                <div className="emotion-tag">Emotion: {message.emotion}</div>
              )}
              {message.isl_video && (
  <div className="isl-video">
    <video controls width="240">
      <source src={message.isl_video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
)}
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
        
        {isProcessingISL && (
          <div className="processing-indicator">
            Converting text to Indian Sign Language...
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
            isCurrentUserBlocked || isReceiverBlocked 
              ? "You cannot send a message" 
              : isProcessingISL
                ? "Converting to ISL..." 
                : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked || isProcessingISL}
        />

        <div className="emoji">
          <img src="./emoji.png" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button 
          className="sendButton" 
          onClick={handleSend} 
          disabled={isCurrentUserBlocked || isReceiverBlocked || isProcessingISL || !text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;