import { supabase } from "./supabase";

const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("chat-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase
    .storage
    .from("chat-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

export default uploadToSupabase;
