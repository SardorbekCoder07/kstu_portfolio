import { toast } from "sonner";
import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

//Typelar

export interface DashboardStats {
  countAllUsers: number;
  countMale: number;
  countFemale: number;
  countAcademic: number;
}

export interface GenderStats {
  total: number;
  maleCount: number;
  femaleCount: number;
  malePercentage: number;
  femalePercentage: number;
}

export interface AgeGroupStats {
  total: number;
  maleCount: number;
  femaleCount: number;
  ageGroup: string;
  percentage: number;
}
export interface LavozimStats {
  name: string;
  totalEmployees: number;
}
export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface GenderResponse {
  success: boolean;
  message: string;
  data: GenderStats;
}

export interface AgeResponse {
  success: boolean;
  message: string;
  data: AgeGroupStats[];
}

export interface LavozimStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    data: LavozimStats[];
  };
}

//Apilar

// user/dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axiosClient.get<DashboardResponse>(
      API_ENDPOINTS.USERDASHBOARD
    );
    return response.data.data;
  } catch (error: any) {
    toast.error("❌ GET Dashboard Error:", error.response?.data || error.message);
    throw error;
  }
};

// user/gender-dashboard
export const getGenderStats = async (): Promise<GenderStats> => {
  try {
    const response = await axiosClient.get<GenderResponse>(
      API_ENDPOINTS.USERGENDERDASHBOARD
    );
    return response.data.data;
  } catch (error: any) {
    toast.error("❌ GET Gender Error:", error.response?.data || error.message);
    throw error;
  }
};
// user/age-dashboard
export const getAgeStats = async (): Promise<AgeGroupStats[]> => {
  try {
    const response = await axiosClient.get<AgeResponse>(
      API_ENDPOINTS.USERAGEDASHBOARD
    );
    return response.data.data;
  } catch (error: any) {
    toast.error("❌ GET Age Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getLavozimStatistics = async (): Promise<LavozimStats[]> => {
  try {
    const response = await axiosClient.get<LavozimStatsResponse>(
      API_ENDPOINTS.LAVOZIMAPISTATISTICS
    );
    return response.data.data.data;
  } catch (error: any) {
    toast.error("❌ GET Lavozim Error:", error.response?.data || error.message);
    throw error;
  }
};