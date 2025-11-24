import { toast } from 'sonner';
import {
  createDepartment,
  getDepartments,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  GetDepartmentsParams,
} from '../api/pagesApi/departmentsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDepartmentOperations = (
  params?: GetDepartmentsParams,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
    refetch,
  } = useQuery({
    queryKey: ['departments', params],
    queryFn: () => getDepartments(params),
  });

  const {
    data: allDepartmentsData,
    isLoading: isAllDepartmentsLoading,
    error: allDepartmentsError,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['departments-all'],
    queryFn: getAllDepartments,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      toast.success("Kafedra muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments-all'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        "Kafedra qo'shishda xatolik yuz berdi!"
      );
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateDepartment(id, data),
    onSuccess: () => {
      toast.success('Kafedra muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments-all'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        'Kafedrani yangilashda xatolik yuz berdi!'
      );
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      toast.success("Kafedra muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments-all'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        "Kafedrani o'chirishda xatolik yuz berdi!"
      );
    },
  });

  return {
    // Paginated Data
    departments: departmentsData?.body || [],
    total: departmentsData?.totalElements || 0,
    page: departmentsData?.page || 0,
    size: departmentsData?.size || 10,
    totalPages: departmentsData?.totalPage || 1,
    isDepartmentsLoading,
    departmentsError,
    refetch,

    // All Departments Data
    allDepartments: allDepartmentsData || [],
    isAllDepartmentsLoading,
    allDepartmentsError,
    refetchAll,

    // Mutations
    createDepartmentMutation,
    updateDepartmentMutation,
    deleteDepartmentMutation,
  };
};

