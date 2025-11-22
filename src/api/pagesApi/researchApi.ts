// api/pagesApi/researchApi.ts

import axiosClient from "../axiosClient";

export interface ResearchItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: string;
}

export interface ResearchResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: ResearchItem[];
  };
}

// api/pagesApi/researchApi.ts
export const createResearch = async (data: {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: string;
}) => {
  const response = await axiosClient.post("/research", data);
  return response.data;
};

export const fetchResearch = async (): Promise<ResearchItem[]> => {
  const res = await axiosClient.get<ResearchResponse>("/research?page=0&size=10");

  if (!res.data.success) {
    throw new Error("Tadqiqotlarni olishda xatolik");
  }

  return res.data.data.body; // faqat body ni qaytaryapmiz
};

// PDF yuklash uchun (tadqiqot uchun)
export const uploadTeacherPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(API_ENDPOINTS.FILEPDF || "/file/pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend turli formatlarda qaytarishi mumkin
  return (
    response.data?.data ||
    response.data?.fileUrl ||
    response.data?.url ||
    response.data?.path ||
    response.data ||
    ""
  );
};