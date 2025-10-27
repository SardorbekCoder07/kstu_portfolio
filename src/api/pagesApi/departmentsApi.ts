import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../endpoints';
export interface Department {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentCreateData {
  name: string;
  imgUrl: string;
  collegeId: number;
}

export interface DepartmentUpdateData {
  name?: string;
  imgUrl?: string;
  collegeId?: number;
}

export interface GetDepartmentsParams {
  page?: number;
  size?: number;
  name?: string;
  collegeId?: number;
}

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

export const getDepartments = async (
  params?: GetDepartmentsParams
): Promise<DepartmentsResponse['data']> => {
  const queryParams: any = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  if (params?.name && params.name.trim()) {
    queryParams.name = params.name.trim();
  }

  if (params?.collegeId) {
    queryParams.collegeId = params.collegeId;
  }

  // console.log('📤 GET Request URL:', '/department/page');
  // console.log('📤 GET Request params:', queryParams);

  try {
    const response = await axiosClient.get<DepartmentsResponse>(
      `${API_ENDPOINTS.DEPARTMENT}/page`,
      { params: queryParams }
    );

    console.log('📥 GET Response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ GET Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createDepartment = async (
  data: DepartmentCreateData
): Promise<Department> => {
  // console.log('📤 POST Request URL:', '/department');
  // console.log('📤 POST Request body:', data);

  try {
    const response = await axiosClient.post(
      `${API_ENDPOINTS.DEPARTMENT}`,
      data
    );
    // console.log('📥 POST Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ POST Error:', error.response?.data || error.message);
    console.error('❌ POST Error Full:', error);
    throw error;
  }
};

export const updateDepartment = async (
  id: number,
  data: DepartmentUpdateData
): Promise<Department> => {
  // console.log('📤 PUT Request URL:', `${API_ENDPOINTS.DEPARTMENT}/{id}`);
  // console.log('📤 PUT Request body:', data);

  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.DEPARTMENT}/${id}`,
      data
    );
    // console.log('📥 PUT Response:', response.data);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
  // console.log('📤 DELETE Request URL:', `/department/${id}`);

  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.DEPARTMENT}/${id}`
    );
    console.log('📥 DELETE Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ DELETE Error:', error.response?.data || error.message);
    throw error;
  }
};
