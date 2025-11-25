import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../endpoints';

export interface Research {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: 'MILLIY' | 'XALQARO';
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchCreateData {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: 'MILLIY' | 'XALQARO';
}

export interface ResearchUpdateData {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: 'MILLIY' | 'XALQARO';
}

export interface GetResearchParams {
  page?: number;
  size?: number;
  name?: string;
  userId?: number;
  memberEnum?: 'MILLIY' | 'XALQARO';
  finished?: boolean;
}

export interface ResearchResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Research[];
  };
}
export const getResearchesByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<ResearchResponse['data']> => {
  try {
    const response = await axiosClient.get<ResearchResponse>(
      `${API_ENDPOINTS.RESEARCH}/byUser/${userId}`,
      {
        params: { page, size }
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const uploadResearchPDF = async (file: File): Promise<string> => {
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

export const createResearch = async (
  data: ResearchCreateData
): Promise<Research> => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.RESEARCH,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateResearch = async (
  data: ResearchUpdateData
): Promise<Research> => {
  try {

    const response = await axiosClient.put(
      `${API_ENDPOINTS.RESEARCH}/${data.id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteResearch = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.RESEARCH}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
