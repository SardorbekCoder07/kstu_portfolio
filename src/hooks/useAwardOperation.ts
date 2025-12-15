import { toast } from "sonner";
import {
  createAward,
  getAwardsByUser,
  uploadAwardPDF,
  updateAward,
  deleteAward,
} from "../api/pagesApi/awardApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAwardOperations = (
  userId?: number,
  page: number = 0,
  size: number = 10,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const {
    data: awardData,
    isLoading: isAwardLoading,
    error: awardError,
    refetch,
  } = useQuery({
    queryKey: ["awards", userId, page, size],
    queryFn: () => getAwardsByUser(userId!, page, size),
    enabled: !!userId,
  });

  const createAwardMutation = useMutation({
    mutationFn: createAward,
    onSuccess: () => {
      toast.success("Mukofot muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Mukofot qo'shishda xatolik yuz berdi!");
    },
  });

  const updateAwardMutation = useMutation({
    mutationFn: updateAward,
    onSuccess: () => {
      toast.success("Mukofot muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Mukofotni yangilashda xatolik yuz berdi!"
      );
    },
  });
  const deleteAwardMutation = useMutation({
    mutationFn: deleteAward,
    onSuccess: () => {
      toast.success("Mukofot muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Mukofotni o'chirishda xatolik yuz berdi!"
      );
    },
  });

  const uploadPDFMutation = useMutation({
    mutationFn: uploadAwardPDF,
    onSuccess: () => {},

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "PDF yuklashda xatolik yuz berdi!"
      );
    },
  });

  return {
    awards: awardData?.body || [],
    total: awardData?.totalElements || 0,
    page: awardData?.page || 0,
    size: awardData?.size || 10,
    totalPages: awardData?.totalPage || 1,
    isAwardLoading,
    awardError,
    refetch,

    createAwardMutation,
    updateAwardMutation,
    deleteAwardMutation,
    uploadPDFMutation,
  };
};
