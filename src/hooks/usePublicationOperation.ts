import { toast } from "sonner";
import {
  createPublication,
  uploadPublicationPDF,
  getPublicationByUser,
  updatePublication,
  deletePublication,
} from "../api/pagesApi/publicationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePublicationOperations = (
  userId?: number,
  page: number = 0,
  size: number = 10,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const {
    data: publicationData,
    isLoading: isPublicationLoading,
    error: publicationError,
    refetch,
  } = useQuery({
    queryKey: ["publications", userId, page, size],
    queryFn: () => getPublicationByUser(userId!, page, size),
    enabled: !!userId,
  });

  const createPublicationMutation = useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      toast.success("Nashr muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Nashr qo'shishda xatolik yuz berdi!");
    },
  });

  const updatePublicationMutation = useMutation({
    mutationFn: updatePublication,
    onSuccess: () => {
      toast.success("Nashr muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Nashrni yangilashda xatolik yuz berdi!"
      );
    },
  });

  const deletePublicationMutation = useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      toast.success("Nashr muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Nashr o'chirishda xatolik yuz berdi!"
      );
    },
  });

  const uploadPDFMutation = useMutation({
    mutationFn: uploadPublicationPDF,
    onSuccess: () => {},
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "PDF yuklashda xatolik yuz berdi!"
      );
    },
  });

  return {
        publications: publicationData?.body || [],
        total: publicationData?.totalElements || 0,
        page: publicationData?.page || 0,
        size: publicationData?.size || 10,
        totalPages: publicationData?.totalPage || 1,
        isPublicationLoading,
        publicationError,
        refetch,

        createPublicationMutation,
        updatePublicationMutation,
        deletePublicationMutation,
        uploadPDFMutation,
    };

};
