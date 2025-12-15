import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../endpoints';

export interface Position {
  id: number;
  name: string;
}

export interface PositionCreateData {
  name: string;
}

export interface PositionUpdateData {
  name: string;
}

export interface PositionsResponse {
  success: boolean;
  message: string;
  data: Position[];
}

export const getPositions = async (): Promise<Position[]> => {

  try {
    const response = await axiosClient.get<PositionsResponse>(
      `${API_ENDPOINTS.POSITION}`
    );

    return response.data.data;
  } catch (error: any) {
    console.error('❌ GET Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createPosition = async (
  data: PositionCreateData
): Promise<Position> => {
  try {
    const response = await axiosClient.post(`${API_ENDPOINTS.POSITION}`, data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ POST Error:', error.response?.data || error.message);
    console.error('❌ POST Error Full:', error);
    throw error;
  }
};

export const updatePosition = async (
  id: number,
  data: PositionUpdateData
): Promise<Position> => {

  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.POSITION}/${id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePosition = async (id: number): Promise<void> => {

  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.POSITION}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error('❌ DELETE Error:', error.response?.data || error.message);
    throw error;
  }
};
