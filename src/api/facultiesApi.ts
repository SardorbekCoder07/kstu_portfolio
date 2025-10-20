// sizning axios clientingiz

import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './endpoints';

// File upload API
export const uploadFacultyImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); // yoki 'image' - backend ga qarab

  const response = await axiosClient.post(API_ENDPOINTS.FILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; // { id: "123", url: "..." } kabi
};

// Fakultet qo'shish API
export const createFaculty = async (data: { name: string; imgUrl: string }) => {
  const response = await axiosClient.post(API_ENDPOINTS.FACULTIES, data);
  return response.data;
};

// Fakultetlar ro'yxatini olish (agar kerak bo'lsa)
export const getFaculties = async () => {
  const response = await axiosClient.get(API_ENDPOINTS.FACULTIES);
  return response.data.data || [];
};

export const updateFaculty = async ({
  id,
  data,
}: {
  id: number;
  data: { name: string; imgUrl: string };
}) => {
  const response = await axiosClient.put(
    `${API_ENDPOINTS.FACULTIES}/${id}`,
    data
  );
  return response.data.data || response.data;
};

export const deleteFaculty = async (id: number) => {
  const response = await axiosClient.delete(`${API_ENDPOINTS.FACULTIES}/${id}`);
  return response.data;
};
