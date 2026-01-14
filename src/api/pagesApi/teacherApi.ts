import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export interface Teacher {
  id: number;
  name: string;
  lavozim: string;
  email: string;
  imageUrl: string;
  input: string;
  phoneNumber: string;
  departmentName: string;
}

export interface TeacherCreateData {
  fullName: string;
  phoneNumber: string;
  biography: string;
  imgUrl: string;
  fileUrl: string;
  input: string;
  profession: string;
  lavozmId: number;
  email: string;
  age: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface TeacherUpdateData {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string;
  age: number;
  gender: boolean;
  input?: string;
  imgUrl?: string;
  fileUrl?: string;
  profession?: string;
}

export interface GetTeachersParams {
  page?: number;
  size?: number;
  name?: string;
  lavozim?: string;
  college?: string;
}

export interface TeachersResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Teacher[];
  };
}

export interface TeacherStatisticsData {
  tadqiqotlar: number;
  nashrlar: number;
  maqolalar: number;
  kitoblar: number;
  ishYuritishlar: number;
  boshqalar: number;
  nazorat: number;
  maslahatlar: number;
  mukofotlar: number;
  treninglar: number;
  tahririyatAzolik: number;
  maxsusKengash: number;
  patentlar: number;
  davlatMukofotlari: number;
}

export interface TeacherStatistics {
  success: boolean;
  message: string;
  data: TeacherStatisticsData;
}

export interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string;
  input: string;
  imgUrl: string;
  role: string;
  fileUrl: string | null;
  profession: string | null;
  lavozimName: string;
  departmentName: string;
  age: number; // ← qo‘shildi
  gender: boolean; // agar kerak bo‘lsa
  qualification: { body: any[] };
  research: { body: any[] };
  award: { body: any[] };
  consultation: { body: any[] };
  nazorat: { body: any[] };
  publication: { body: any[] };
}

export interface Pagination<T = any> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface TeacherResponse {
  success: boolean;
  message: string;
  data: Teacher;
}

export const uploadTeacherImage = async (file: File): Promise<string> => {
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
export const uploadTeacherPDF = async (file: File): Promise<string> => {
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

export const getTeachers = async (
  params?: GetTeachersParams
): Promise<TeachersResponse["data"]> => {
  const queryParams: any = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  if (params?.name && params.name.trim()) {
    queryParams.name = params.name.trim();
  }

  if (params?.lavozim && params.lavozim.trim()) {
    queryParams.lavozim = params.lavozim.trim();
  }

  if (params?.college && params.college.trim()) {
    queryParams.college = params.college.trim();
  }


  try {
    const response = await axiosClient.get<TeachersResponse>(
      `${API_ENDPOINTS.USERS}search`,
      {
        params: queryParams,
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "❌ GET Teachers Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const createTeacher = async (
  data: TeacherCreateData
): Promise<Teacher> => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTHSAVEUSER, data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(
      "❌ POST Teacher Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTeacher = async (
  data: TeacherUpdateData
): Promise<Teacher> => {
  try {

    const response = await axiosClient.put(API_ENDPOINTS.EDITUSERS, data);

    return response.data.data || response.data;
  } catch (error: any) {
    console.error(
      "❌ PUT Teacher Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
