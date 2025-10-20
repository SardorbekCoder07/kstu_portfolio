import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { toast } from 'sonner';
import {
  createFaculty,
  uploadFacultyImage,
  updateFaculty,
  deleteFaculty,
} from '../api/facultiesApi';

export const useFacultyOperations = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const uploadImageMutation = useMutation({
    mutationFn: uploadFacultyImage,
    onSuccess: data => {
      message.success('Rasm muvaffaqiyatli yuklandi!');
      return data.imgUrl || data.url || data;
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Rasm yuklashda xatolik!'
      );
      throw error;
    },
  });

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
    uploadImageMutation,
    createFacultyMutation,
    updateFacultyMutation,
    deleteFacultyMutation,
  };
};
