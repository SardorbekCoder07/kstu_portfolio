import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export enum FinishedEnum {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface AdviceCreate {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

export interface AdviceUpdate {
  id: number; // update qilinadigan obyektning ID si
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

export interface Advice {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

export interface AdviceResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Advice[];
  };
}

export const getAdviceByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<AdviceResponse['data']> => {
  try {
    const response = await axiosClient.get<AdviceResponse>(
      `${API_ENDPOINTS.ADVICE}/byUser/${userId}`,
      {
        params: { page, size }
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const uploadAdvicePDF = async (file: File): Promise<string> => {
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

export const createAdvice = async (
  data: AdviceCreate
): Promise<Advice> => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.ADVICE,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateAdvice = async (
  data: AdviceUpdate
): Promise<Advice> => {
  try {

    const response = await axiosClient.put(
      `${API_ENDPOINTS.ADVICE}/${data.id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteAdvice = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.ADVICE}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

