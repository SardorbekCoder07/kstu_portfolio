import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export enum AwardEnum {
  Trening_Va_Amaliyot = "Trening_Va_Amaliyot",
  // boshqa qiymatlar bo‘lsa, ularni shu yerga qo‘shishingiz mumkin
}

export enum MemberEnum {
  MILLIY = "MILLIY",
  XALQARO = "XALQARO", // agar boshqa variantlar bo‘lsa
}

export interface AwardCreateData {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}

export interface AwardUpdateData {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}

export interface AwardData {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}

export interface AwardResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: AwardData[];
  };
}

export const getAwardsByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<AwardResponse["data"]> => {
  try {
    const response = await axiosClient.get<AwardResponse>(
      `${API_ENDPOINTS.AWARD}/byUser/${userId}`,
      {
        params: { page, size },
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const createAward = async (
  data: AwardCreateData
): Promise<AwardData> => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AWARD, data);
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateAward = async (
  data: AwardUpdateData
): Promise<AwardData> => {
  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.AWARD}/${data.id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteAward = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.AWARD}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const uploadAwardPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post(
    API_ENDPOINTS.FILEPDF,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return (
    response.data.data ||
    response.data.fileUrl ||
    response.data.url ||
    response.data
  );
};
