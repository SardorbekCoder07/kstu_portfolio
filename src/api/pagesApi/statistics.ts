import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

// -----------------------------
// ✅ Types
// -----------------------------

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

// -----------------------------
// ✅ Responses
// -----------------------------
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

// -----------------------------
// ✅ API Calls
// -----------------------------

// 1️⃣ /user/dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axiosClient.get<DashboardResponse>(
      API_ENDPOINTS.USERDASHBOARD
    );
    console.log("📥 GET Dashboard Response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ GET Dashboard Error:", error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ /user/gender-dashboard
export const getGenderStats = async (): Promise<GenderStats> => {
  try {
    const response = await axiosClient.get<GenderResponse>(
      API_ENDPOINTS.USERGENDERDASHBOARD
    );
    console.log("📥 GET Gender Response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ GET Gender Error:", error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ /user/age-dashboard
export const getAgeStats = async (): Promise<AgeGroupStats[]> => {
  try {
    const response = await axiosClient.get<AgeResponse>(
      API_ENDPOINTS.USERAGEDASHBOARD
    );
    console.log("📥 GET Age Response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ GET Age Error:", error.response?.data || error.message);
    throw error;
  }
};
