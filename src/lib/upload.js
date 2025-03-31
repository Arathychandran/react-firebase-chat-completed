// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage } from "./firebase";

// const upload = async (file) => {
//   const date = new Date();
//   const storageRef = ref(storage, `images/${date + file.name}`);

//   const uploadTask = uploadBytesResumable(storageRef, file);

//   return new Promise((resolve, reject) => {
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//       },
//       (error) => {
//         reject("Something went wrong!" + error.code);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       }
//     );
//   });
// };

// export default upload;


import { supabase } from "./supabase";

const upload = async (file) => {
  if (!file) throw new Error("No file selected");

  const filePath = `profile/images/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from("profile") // ✅ Make sure this matches your Supabase bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  return `https://ozhrjiglxmktxyizfnjh.supabase.co/storage/v1/object/public/${filePath}`;
};

export default upload;
