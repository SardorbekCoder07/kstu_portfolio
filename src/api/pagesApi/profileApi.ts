import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

/* ================= TYPES ================= */

export interface Profile {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string | null;
  input: string | null;
  age: number;
  gender: boolean;
  imageUrl: string | null;
  role: string;
  fileUrl: string | null;
  profession: string | null;
  lavozimName: string | null;
  departmentName: string | null;
  qualification: string | null;
  lavozmId?: number;
  departmentId?: number;
}

/* ================= GET PROFILE ================= */

export const getProfile = async (): Promise<{ body: Profile }> => {
  const res = await axiosClient.get("/user");

  if (!res.data?.success) {
    throw new Error("Profil ma’lumotlarini olishda xatolik yuz berdi");
  }

  return {
    body: res.data.data,
  };
};

/* ================= UPDATE PROFILE ================= */

export const updateProfile = async (payload: Partial<Profile>) => {
  const res = await axiosClient.put("/user", payload);

  if (!res.data?.success) {
    throw new Error("Profilni yangilashda xatolik yuz berdi");
  }

  const cached = localStorage.getItem("user_cache");
  const oldProfile = cached ? JSON.parse(cached) : {};

  const updatedProfile = { ...oldProfile, ...payload };

  localStorage.setItem("user_cache", JSON.stringify(updatedProfile));

  return updatedProfile;
};

/* ================= UPLOAD IMAGE ================= */

export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(API_ENDPOINTS.FILE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return (
    response.data.data ||
    response.data.imgUrl ||
    response.data.url ||
    response.data
  );
};

/* ================= UPLOAD PDF ================= */

export const uploadProfilePDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(API_ENDPOINTS.FILEPDF, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return (
    response.data.data ||
    response.data.fileUrl ||
    response.data.url ||
    response.data
  );
};
