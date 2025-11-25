import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export interface ControlItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  researcherName: string;     // majburiy
  univerName?: string;
  level?: string;             // Usta, O'rta, Boshlang'ich
  finished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ControlData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: ControlItem[];
}

export interface ControlResponse {
  success: boolean;
  message: string;
  data: ControlData | ControlItem;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// export const getNazoratByUser = async (
//   userId: number,
//   page: number = 0,
//   size: number = 10
// ): Promise<ControlData> => {
//   const response = await axiosClient.get<ControlResponse>(
//     `${API_ENDPOINTS.NAZORAT}/byUser/${userId}`,
//     { params: { page, size } }
//   );
//   return response.data.data as ControlData;
// };

export const getNazoratByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<ControlData> => {
  try {
    const response = await axiosClient.get<ControlResponse>(
      `${API_ENDPOINTS.NAZORAT}/byUser/${userId}`,
      {
        params: { page, size }
      }
    );

    return response.data.data as ControlData;
  } catch (error: any) {
    throw error;
  }
};

// export const createNazorat = async (payload: Partial<ControlItem>): Promise<ControlItem> => {
//   const response = await axiosClient.post<ControlResponse>(API_ENDPOINTS.NAZORAT, payload);
//   return response.data.data as ControlItem;
// };

export const createNazorat = async (
  data: ControlItem
): Promise<ControlItem> => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.NAZORAT,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

// export const updateNazorat = async (payload: Partial<ControlItem> & { id: number }): Promise<ControlItem> => {
//   const { id, ...data } = payload;
//   const response = await axiosClient.put<ControlResponse>(`${API_ENDPOINTS.NAZORAT}/${id}`, data);
//   return response.data.data as ControlItem;
// };

export const updateNazorat = async (
  data: ControlItem
): Promise<ControlItem> => {
  try {

    const response = await axiosClient.put(
      `${API_ENDPOINTS.NAZORAT}/${data.id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

// export const deleteNazorat = async (id: number): Promise<void> => {
//   await axiosClient.delete(`${API_ENDPOINTS.NAZORAT}/${id}`);
// };

export const deleteNazorat = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.NAZORAT}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// export const uploadControlPDF = async (file: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await axiosClient.post<ApiResponse<{ url: string }>>(
//     `${API_ENDPOINTS.FILEPDF}`,
//     formData,
//     {
//       headers: { "Content-Type": "multipart/form-data" },
//     }
//   );

//   return response.data.data.url;
// };

export const uploadControlPDF = async (file: File): Promise<string> => {
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