import { create } from 'zustand';
import axios from 'axios';
import { message } from 'antd';

interface UploadState {
  file: File | null;
  uploadedUrl: string | null;
  progress: number;
  setFile: (file: File | null) => void;
  uploadFile: (url: string) => Promise<string | null>;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  file: null,
  uploadedUrl: null,
  progress: 0,

  setFile: file => set({ file }),

  uploadFile: async url => {
    const { file } = get();

    if (!file) {
      message.warning('Iltimos, fayl tanlang!');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file); // backend nomi bilan mos bo‘lishi kerak

    try {
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event: ProgressEvent) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            set({ progress: percent });
          }
        },
      });

      const imageUrl = response.data?.url || response.data?.path || '';
      if (imageUrl) {
        set({ uploadedUrl: imageUrl });
        message.success('Fayl muvaffaqiyatli yuklandi!');
        return imageUrl;
      } else {
        message.error('Rasm URL qaytmadi!');
        return null;
      }
    } catch (error) {
      console.error('Upload xatolik:', error);
      message.error('Yuklashda xatolik yuz berdi!');
      return null;
    } finally {
      set({ progress: 0, file: null });
    }
  },

  reset: () => set({ file: null, progress: 0, uploadedUrl: null }),
}));