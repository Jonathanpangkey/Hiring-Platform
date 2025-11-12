import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadCandidatePhoto = async (file: File, candidateId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${candidateId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const {data, error} = await supabase.storage.from("profil_candidate").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const {data: urlData} = supabase.storage.from("profil_candidate").getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
