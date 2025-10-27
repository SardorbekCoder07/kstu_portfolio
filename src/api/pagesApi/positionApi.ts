import { toast } from 'sonner';
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
  // console.log('GET Request URL:', '/lavozim');

  try {
    const response = await axiosClient.get<PositionsResponse>(
      `${API_ENDPOINTS.POSITION}`
    );

    console.log(' GET Response position:', response.data);
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
    // console.log(' POST Response:', response.data);
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
  // console.log('📤 PUT Request URL:', `/lavozim/${id}`);
  // console.log('📤 PUT Request body:', data);

  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.POSITION}/${id}`,
      data
    );
    // console.log('📥 PUT Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePosition = async (id: number): Promise<void> => {
  // console.log('📤 DELETE Request URL:', `/lavozim/${id}`);

  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.POSITION}/${id}`
    );
    console.log('📥 DELETE Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ DELETE Error:', error.response?.data || error.message);
    throw error;
  }
};
