import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export interface ControlItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  researcherName: string;
  univerName: string;
  level: string;
  memberEnum: "XALQARO" | "MILLIY";
  finished: boolean;
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
  data: ControlData;
}

export const getNazoratByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<ControlResponse["data"]> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.NAZORAT}/byUser/${userId}`,
      {
        params: { page, size },
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};
