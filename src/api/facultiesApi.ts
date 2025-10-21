import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './endpoints';

// ✅ Types
export interface Faculty {
  id: number;
  name: string;
  imgUrl: string;
  departmentCount?: number;
  departmentNames?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FacultyCreateData {
  name: string;
  imgUrl: string;
}

export interface FacultyUpdateData {
  name?: string;
  imgUrl?: string;
}

export interface GetFacultiesParams {
  page?: number;
  size?: number;
  name?: string;
}

// ✅ Backend response struktura
export interface FacultiesResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Faculty[];
  };
}

// ✅ Rasm yuklash
export const uploadFacultyImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post(API_ENDPOINTS.FILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Backend qaytargan rasm URL ni olish
  return (
    response.data.data ||
    response.data.imgUrl ||
    response.data.url ||
    response.data
  );
};

// ✅ GET - Fakultetlarni olish (pagination bilan)
export const getFaculties = async (
  params?: GetFacultiesParams
): Promise<FacultiesResponse['data']> => {
  const queryParams: any = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  if (params?.name && params.name.trim()) {
    queryParams.name = params.name.trim();
  }

  console.log('📤 GET Faculties Request URL:', '/college/page');
  console.log('📤 GET Faculties Request params:', queryParams);

  try {
    const response = await axiosClient.get<FacultiesResponse>('/college/page', {
      params: queryParams,
    });

    console.log('📥 GET Faculties Response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      '❌ GET Faculties Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ GET - Barcha fakultetlar (dropdown uchun)
export const getAllFaculties = async (): Promise<Faculty[]> => {
  const response = await axiosClient.get(API_ENDPOINTS.FACULTIES);
  return response.data.data || [];
};

// ✅ CREATE - Fakultet qo'shish
export const createFaculty = async (
  data: FacultyCreateData
): Promise<Faculty> => {
  console.log('📤 POST Faculty Request:', data);

  try {
    const response = await axiosClient.post(API_ENDPOINTS.FACULTIES, data);
    console.log('📥 POST Faculty Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(
      '❌ POST Faculty Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ UPDATE - Fakultetni yangilash
export const updateFaculty = async ({
  id,
  data,
}: {
  id: number;
  data: FacultyUpdateData;
}): Promise<Faculty> => {
  console.log('📤 PUT Faculty Request:', { id, data });

  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.FACULTIES}/${id}`,
      data
    );
    console.log('📥 PUT Faculty Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(
      '❌ PUT Faculty Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ DELETE - Fakultetni o'chirish
export const deleteFaculty = async (id: number): Promise<void> => {
  console.log('📤 DELETE Faculty Request:', id);

  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.FACULTIES}/${id}`
    );
    console.log('📥 DELETE Faculty Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ DELETE Faculty Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};
