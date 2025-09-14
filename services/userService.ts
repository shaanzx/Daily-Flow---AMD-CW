import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const getUser = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUser = async (uid: string, data: any) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
};

export const uploadProfileImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);
  formData.append("upload_preset", "your_upload_preset");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dapuhsyvd/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};
