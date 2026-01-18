import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadProfilePDF,
} from "../api/pagesApi/profileApi";

export const useProfileOperations = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  // ✅ PROFILE GET
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    error: profileError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // ✅ IMAGE UPLOAD
  const uploadImageMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Rasm yuklashda xatolik!");
      throw error;
    },
  });

  // ✅ PDF UPLOAD
  const uploadPDFMutation = useMutation({
    mutationFn: uploadProfilePDF,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "PDF yuklashda xatolik!");
    },
  });

  // ✅ UPDATE PROFILE
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profil muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Profilni yangilashda xatolik yuz berdi!",
      );
    },
  });

  return {
    // DATA
    profile: profileData?.body || null,
    isProfileLoading,
    isProfileFetching,
    profileError,
    refetch,

    // MUTATIONS
    updateProfileMutation,
    uploadImageMutation,
    uploadPDFMutation,
  };
};
