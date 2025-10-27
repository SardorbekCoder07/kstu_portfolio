// src/hooks/usePositionOperations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPosition,
  deletePosition,
  getPositions,
  PositionCreateData,
  PositionUpdateData,
  updatePosition,
} from '../api/pagesApi/positionApi';
import { toast } from 'sonner';

const POSITION_QUERY_KEY = ['positions'];

export const usePositionOperations = () => {
  const queryClient = useQueryClient();

  const {
    data: positions = [],
    isLoading: loading,
    refetch: fetchPositions,
  } = useQuery({
    queryKey: POSITION_QUERY_KEY,
    queryFn: getPositions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const addPositionMutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSITION_QUERY_KEY });
      toast.success("Lavozim muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Lavozim qo'shishda xatolik yuz berdi"
      );
      console.error('Create position error:', error);
    },
  });
  const editPositionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PositionUpdateData }) =>
      updatePosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSITION_QUERY_KEY });
      toast.success('Lavozim muvaffaqiyatli tahrirlandi');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          'Lavozimni tahrirlashda xatolik yuz berdi'
      );
      console.error('Update position error:', error);
    },
  });

  const removePositionMutation = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSITION_QUERY_KEY });
      toast.success("Lavozim muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Lavozimni o'chirishda xatolik yuz berdi"
      );
      console.error('Delete position error:', error);
    },
  });

  const addPosition = async (data: PositionCreateData) => {
    try {
      let addPosition = await addPositionMutation.mutateAsync(data);
      if (addPosition.success) {
        toast.success("Lavozim muvaffaqqiyatli qo'shildi");
        return true;
      } else {
        toast.error("Bu lavozim allaqochon qo'shilgan");
        return false;
      }
    } catch {
      return false;
    }
  };

  const editPosition = async (id: number, data: PositionUpdateData) => {
    try {
      await editPositionMutation.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  };

  const removePosition = async (id: number) => {
    try {
      await removePositionMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    positions,
    loading,
    fetchPositions,
    addPosition,
    editPosition,
    removePosition,
    isAdding: addPositionMutation.isPending,
    isEditing: editPositionMutation.isPending,
    isDeleting: removePositionMutation.isPending,
  };
};
