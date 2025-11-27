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

export interface SingleDepartment {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
  collegeName: string;
}

export interface AllDepartment {
  success: boolean;
  message: string;
  data: SingleDepartment[];
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

export const getAllDepartments = async (): Promise<SingleDepartment[]> => {
  try {
    const response = await axiosClient.get<AllDepartment>(
      `${API_ENDPOINTS.DEPARTMENT}/list`
    );

    return response.data.data;
  } catch (error: any) {
    console.error('GET All Departments Error:', error.response?.data || error.message);
    throw error;
  }
};

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


  try {
    const response = await axiosClient.get<DepartmentsResponse>(
      `${API_ENDPOINTS.DEPARTMENT}/page`,
      { params: queryParams }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('❌ GET Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createDepartment = async (
  data: DepartmentCreateData
): Promise<Department> => {
  try {
    const response = await axiosClient.post(
      `${API_ENDPOINTS.DEPARTMENT}`,
      data
    );
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
  try {
    const response = await axiosClient.put(
      `${API_ENDPOINTS.DEPARTMENT}/${id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {

  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.DEPARTMENT}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error('❌ DELETE Error:', error.response?.data || error.message);
    throw error;
  }
};
