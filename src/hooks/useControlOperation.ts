import { toast } from "sonner";
import {
  createNazorat,
  uploadControlPDF,
  getNazoratByUser,
  updateNazorat,
  deleteNazorat,
} from "../api/pagesApi/controlApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useControlOperations = (
  userId?: number,
  page: number = 0,
  size: number = 10,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const {
    data: ControlData,
    isLoading: isControlLoading,
    error: ControlError,
    refetch,
  } = useQuery({
    queryKey: ["controles", userId, page, size],
    queryFn: () => getNazoratByUser(userId!, page, size),
    enabled: !!userId,
  });

  const createControlMutation = useMutation({
    mutationFn: createNazorat,
    onSuccess: () => {
      toast.success("Nazorat muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ["controles"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Nazorat qo'shishda xatolik yuz berdi!");
    },
  });
  const updateControlMutation = useMutation({
    mutationFn: updateNazorat,
    onSuccess: () => {
      toast.success("Nazorat muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["controles"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Nazoratni yangilashda xatolik yuz berdi!"
      );
    },
  });

  const deleteControlMutation = useMutation({
    mutationFn: deleteNazorat,
    onSuccess: () => {
      toast.success("Nazorat muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["controles"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Nazoratni o'chirishda xatolik yuz berdi!"
      );
    },
  });

  const uploadPDFMutation = useMutation({
    mutationFn: uploadControlPDF,
    onSuccess: () => {},
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "PDF yuklashda xatolik yuz berdi!"
      );
    },
  });

  return {
    controles: ControlData?.body || [],
    total: ControlData?.totalElements || 0,
    page: ControlData?.page || 0,
    size: ControlData?.size || 10,
    totalPages: ControlData?.totalPage || 1,
    isControlLoading,
    ControlError,
    refetch,

    createControlMutation,
    updateControlMutation,
    deleteControlMutation,
    uploadPDFMutation
  };
};
