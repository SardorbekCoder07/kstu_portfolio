import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './endpoints';

// ✅ Backend uchun to'g'ri Types
export interface Department {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number; // ✅ facultyId emas, collegeId
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentCreateData {
  name: string;
  imgUrl: string;
  collegeId: number; // ✅ To'g'ri field nomi
}

export interface DepartmentUpdateData {
  name?: string;
  imgUrl?: string;
  collegeId?: number; // ✅ To'g'ri field nomi
}

export interface GetDepartmentsParams {
  page?: number;
  size?: number;
  name?: string;
  collegeId?: number;
}

// Backend response struktura
export interface DepartmentsResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Department[];
  };
}

// ✅ GET - Kafedralarni olish
export const getDepartments = async (
  params?: GetDepartmentsParams
): Promise<DepartmentsResponse['data']> => {
  const queryParams: any = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  // ✅ name parametri (agar bo'lsa qo'shish)
  if (params?.name && params.name.trim()) {
    queryParams.name = params.name.trim();
  }

  if (params?.collegeId) {
    queryParams.collegeId = params.collegeId;
  }

  console.log('📤 GET Request URL:', '/department/page');
  console.log('📤 GET Request params:', queryParams);

  try {
    const response = await axiosClient.get<DepartmentsResponse>(
      '/department/page',
      { params: queryParams }
    );

    console.log('📥 GET Response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ GET Error:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ CREATE - Kafedra qo'shish
export const createDepartment = async (
  data: DepartmentCreateData
): Promise<Department> => {
  console.log('📤 POST Request URL:', '/department');
  console.log('📤 POST Request body:', data);

  try {
    const response = await axiosClient.post('/department', data);
    console.log('📥 POST Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ POST Error:', error.response?.data || error.message);
    console.error('❌ POST Error Full:', error);
    throw error;
  }
};

// ✅ UPDATE - Kafedrani yangilash
export const updateDepartment = async (
  id: number,
  data: DepartmentUpdateData
): Promise<Department> => {
  console.log('📤 PUT Request URL:', `/department/${id}`);
  console.log('📤 PUT Request body:', data);

  try {
    const response = await axiosClient.put(`/department/${id}`, data);
    console.log('📥 PUT Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE - Kafedrani o'chirish
export const deleteDepartment = async (id: number): Promise<void> => {
  console.log('📤 DELETE Request URL:', `/department/${id}`);

  try {
    const response = await axiosClient.delete(`/department/${id}`);
    console.log('📥 DELETE Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ DELETE Error:', error.response?.data || error.message);
    throw error;
  }
};
