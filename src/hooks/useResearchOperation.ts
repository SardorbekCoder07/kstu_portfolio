import { toast } from 'sonner';
import {
    createResearch,
    uploadResearchPDF,
    getResearchesByUser,
    updateResearch,
    deleteResearch,
} from '../api/pagesApi/researchApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useResearchOperations = (
    userId?: number,
    page: number = 0,
    size: number = 10,
    onSuccess?: () => void
) => {
    const queryClient = useQueryClient();

    const {
        data: researchData,
        isLoading: isResearchLoading,
        error: researchError,
        refetch,
    } = useQuery({
        queryKey: ['researches', userId, page, size],
        queryFn: () => getResearchesByUser(userId!, page, size),
        enabled: !!userId,
    });

    const createResearchMutation = useMutation({
        mutationFn: createResearch,
        onSuccess: () => {
            toast.success("Tadqiqot muvaffaqiyatli qo'shildi!");
            queryClient.invalidateQueries({ queryKey: ['researches'] });
            onSuccess?.();
        },
        onError: () => {
            toast.error("Tadqiqot qo'shishda xatolik yuz berdi!");
        },
    });

    const updateResearchMutation = useMutation({
        mutationFn: updateResearch,
        onSuccess: () => {
            toast.success('Tadqiqot muvaffaqiyatli yangilandi!');
            queryClient.invalidateQueries({ queryKey: ['researches'] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                'Tadqiqotni yangilashda xatolik yuz berdi!'
            );
        },
    });
    const deleteResearchMutation = useMutation({
        mutationFn: deleteResearch,
        onSuccess: () => {
            toast.success("Tadqiqot muvaffaqiyatli o'chirildi!");
            queryClient.invalidateQueries({ queryKey: ['researches'] });
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "Tadqiqotni o'chirishda xatolik yuz berdi!"
            );
        },
    });

    const uploadPDFMutation = useMutation({
        mutationFn: uploadResearchPDF,
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
        researches: researchData?.body || [],
        total: researchData?.totalElements || 0,
        page: researchData?.page || 0,
        size: researchData?.size || 10,
        totalPages: researchData?.totalPage || 1,
        isResearchLoading,
        researchError,
        refetch,

        createResearchMutation,
        updateResearchMutation,
        deleteResearchMutation,
        uploadPDFMutation,
    };
};