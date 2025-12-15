import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export enum PublicationTypeEnum {
  ARTICLE = "ARTICLE",
  BOOK = "BOOK",
  PROCEEDING = "PROCEEDING",
  OTHERS = "OTHERS",
}

export enum AuthorEnum {
  COAUTHOR = "COAUTHOR",
  FIRST_AUTHOR = "FIRST_AUTHOR",
  BOTH_AUTHOR = "BOTH_AUTHOR",
}

export enum DegreeEnum {
  INTERNATIONAL = "INTERNATIONAL",
  NATIONAL = "NATIONAL",
}

export interface PublicationCreate {
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationTypeEnum;
  author: AuthorEnum;
  degree: DegreeEnum;
  volume: string;
  institution: string;
  popular: boolean;
}

export interface Publication {
  id: number;
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationTypeEnum;
  author: AuthorEnum;
  degree: DegreeEnum;
  volume: string;
  institution: string;
  popular: boolean;
}

export interface PaginationResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Publication[];
  };
}


export interface PublicationByIdResponse {
  success: boolean;
  message: string;
  data: Publication;
}

export interface PublicationUpdate {
  id: number;
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationTypeEnum;
  author: AuthorEnum;
  degree: DegreeEnum;
  volume: string;
  institution: string;
  popular: boolean;
}

export const getPublicationByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<PaginationResponse["data"]> => {
  try {
    const response = await axiosClient.get<PaginationResponse>(
      `${API_ENDPOINTS.PUBLICATION}/byUser/${userId}`,
      {
        params: { page, size },
      }
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const uploadPublicationPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post(
    API_ENDPOINTS.FILEPDF,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return (
    response.data.data ||
    response.data.fileUrl ||
    response.data.url ||
    response.data
  );
};

export const createPublication = async (
  data: PublicationCreate
): Promise<Publication> => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.PUBLICATION,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};


export const updatePublication = async (
  data: PublicationUpdate
): Promise<Publication> => {
  try {

    const response = await axiosClient.put(
      `${API_ENDPOINTS.PUBLICATION}/${data.id}`,
      data
    );
    return response.data.data || response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deletePublication = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(
      `${API_ENDPOINTS.PUBLICATION}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

