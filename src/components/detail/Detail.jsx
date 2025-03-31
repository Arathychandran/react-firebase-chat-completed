// import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
// import { useChatStore } from "../../lib/chatStore";
// import { auth, db } from "../../lib/firebase";
// import { useUserStore } from "../../lib/userStore";
// import "./detail.css";

// const Detail = () => {
//   const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
//     useChatStore();
//   const { currentUser } = useUserStore();

//   const handleBlock = async () => {
//     if (!user) return;

//     const userDocRef = doc(db, "users", currentUser.id);

//     try {
//       await updateDoc(userDocRef, {
//         blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
//       });
//       changeBlock();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleLogout = () => {
//     auth.signOut();
//     resetChat()
//   };

//   return (
//     <div className="detail">
//       <div className="user">
//         <img src={user?.avatar || "./avatar.png"} alt="" />
//         <h2>{user?.username}</h2>
//         <p>Lorem ipsum dolor sit amet.</p>
//       </div>
//       <div className="info">
//         <div className="option">
//           <div className="title">
//             <span>Chat Settings</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Chat Settings</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Privacy & help</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Shared photos</span>
//             <img src="./arrowDown.png" alt="" />
//           </div>
//           <div className="photos">
//             <div className="photoItem">
//               <div className="photoDetail">
//                 <img
//                   src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                   alt=""
//                 />
//                 <span>photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="icon" />
//             </div>
//             <div className="photoItem">
//               <div className="photoDetail">
//                 <img
//                   src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                   alt=""
//                 />
//                 <span>photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="icon" />
//             </div>
//             <div className="photoItem">
//               <div className="photoDetail">
//                 <img
//                   src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                   alt=""
//                 />
//                 <span>photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="icon" />
//             </div>
//             <div className="photoItem">
//               <div className="photoDetail">
//                 <img
//                   src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                   alt=""
//                 />
//                 <span>photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="icon" />
//             </div>
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Shared Files</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <button onClick={handleBlock}>
//           {isCurrentUserBlocked
//             ? "You are Blocked!"
//             : isReceiverBlocked
//             ? "User blocked"
//             : "Block User"}
//         </button>
//         <button className="logout" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Detail;


import { useChatStore } from "../../lib/chatStore";
import { supabase } from "../../lib/supabase"; // Import Supabase client
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("blocked")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;

      let updatedBlockedList = data.blocked || [];
      if (isReceiverBlocked) {
        updatedBlockedList = updatedBlockedList.filter((id) => id !== user.id);
      } else {
        updatedBlockedList.push(user.id);
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ blocked: updatedBlockedList })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      changeBlock();
    } catch (err) {
      console.error("Error updating block status:", err.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      resetChat();
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src="C:\Users\aswat\Pictures\screenshot.png" alt="" />
        <h2>{user?.username}</h2>
        <p>Online status or last seen</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            {/* Dummy shared photos, replace with dynamic data */}
            {[1, 2, 3, 4].map((i) => (
              <div className="photoItem" key={i}>
                <div className="photoDetail">
                  <img
                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                    alt=""
                  />
                  <span>photo_2024_{i}.png</span>
                </div>
                <img src="./download.png" alt="" className="icon" />
              </div>
            ))}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
