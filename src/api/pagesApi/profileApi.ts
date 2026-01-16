import axiosClient from "../axiosClient";

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
  research: string | null;
  award: string | null;
  consultation: string | null;
  nazorat: string | null;
  publication: string | null;
}

export const fetchProfile = async (): Promise<Profile> => {
  const res = await axiosClient.get("/user");
  if (!res.data?.success) throw new Error("Ma’lumotni olishda xatolik yuz berdi");
  return res.data.data;
};
