import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createFaculty,
  uploadFacultyImage,
  updateFaculty,
  deleteFaculty,
  getFaculties,
  GetFacultiesParams,
} from '../api/pagesApi/facultiesApi';

export const useFacultyOperations = (
  params?: GetFacultiesParams,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  // ✅ GET - Fakultetlarni olish (pagination bilan)
  const {
    data: facultiesData,
    isLoading: isFacultiesLoading,
    isFetching: isFacultiesFetching,
    error: facultiesError,
    refetch,
  } = useQuery({
    queryKey: ['faculties', params],
    queryFn: () => getFaculties(params),
    // ✅ Global sozlamalar ishlatiladi (main.tsx dan)
  });

  // ✅ Rasm yuklash
  const uploadImageMutation = useMutation({
    mutationFn: uploadFacultyImage,
    onSuccess: data => {
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Rasm yuklashda xatolik!');
      throw error;
    },
  });

  // ✅ CREATE - Fakultet qo'shish
  const createFacultyMutation = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      toast.success("Fakultet muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Fakultet qo'shishda xatolik yuz berdi!"
      );
    },
  });

  // ✅ UPDATE - Fakultetni yangilash
  const updateFacultyMutation = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      toast.success('Fakultet muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Fakultet yangilashda xatolik yuz berdi!'
      );
    },
  });

  // ✅ DELETE - Fakultetni o'chirish
  const deleteFacultyMutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      toast.success("Fakultet muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Fakultet o'chirishda xatolik yuz berdi!"
      );
    },
  });

  return {
    // Data (pagination bilan)
    faculties: facultiesData?.body || [],
    total: facultiesData?.totalElements || 0,
    page: facultiesData?.page || 0,
    size: facultiesData?.size || 10,
    totalPages: facultiesData?.totalPage || 1,
    isFacultiesLoading,
    isFacultiesFetching, // ✅ Qo'shildi
    facultiesError,
    refetch,

    // Mutations
    uploadImageMutation,
    createFacultyMutation,
    updateFacultyMutation,
    deleteFacultyMutation,
  };
};
