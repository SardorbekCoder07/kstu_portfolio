 import { toast } from 'sonner';
import {
    createAdvice,
    uploadAdvicePDF,
    getAdviceByUser,
    updateAdvice,
    deleteAdvice,
} from '../api/pagesApi/adviceApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdviceOperations = (
    userId?: number,
    page: number = 0,
    size: number = 10,
    onSuccess?: () => void
) => {
    const queryClient = useQueryClient();

    const {
        data: adviceData,
        isLoading: isAdviceLoading,
        error: adviceError,
        refetch,
    } = useQuery({
        queryKey: ['advices', userId, page, size],
        queryFn: () => getAdviceByUser(userId!, page, size),
        enabled: !!userId,
    });

    const createAdviceMutation = useMutation({
        mutationFn: createAdvice,
        onSuccess: () => {
            toast.success("Maslahat muvaffaqiyatli qo'shildi!");
            queryClient.invalidateQueries({ queryKey: ['advices'] });
            onSuccess?.();
        },
        onError: () => {
            toast.error("Maslahat qo'shishda xatolik yuz berdi!");
        },
    });

    const updateAdviceMutation = useMutation({
        mutationFn: updateAdvice,
        onSuccess: () => {
            toast.success('Maslahat muvaffaqiyatli yangilandi!');
            queryClient.invalidateQueries({ queryKey: ['advices'] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                'Maslahatni yangilashda xatolik yuz berdi!'
            );
        },
    });
    const deleteAdviceMutation = useMutation({
        mutationFn: deleteAdvice,
        onSuccess: () => {
            toast.success("Maslahat muvaffaqiyatli o'chirildi!");
            queryClient.invalidateQueries({ queryKey: ['advices'] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "Maslahatni o'chirishda xatolik yuz berdi!"
            );
        },
    });

    const uploadPDFMutation = useMutation({
        mutationFn: uploadAdvicePDF,
        onSuccess: () => {
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "PDF yuklashda xatolik yuz berdi!"
            );
        },
    });

    return {
        advices: adviceData?.body || [],
        total: adviceData?.totalElements || 0,
        page: adviceData?.page || 0,
        size: adviceData?.size || 10,
        totalPages: adviceData?.totalPage || 1,
        isAdviceLoading,
        adviceError,
        refetch,

        createAdviceMutation,
        updateAdviceMutation,
        deleteAdviceMutation,
        uploadPDFMutation,
    };
};