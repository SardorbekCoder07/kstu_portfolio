import { Button, Input, message, Modal, Popconfirm, Space, Image } from 'antd';
import {
  PlusOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useModalStore } from '../../stores/useModalStore';
import CustomTable from '../../components/ui/table/CustomTable';
import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFaculty,
  getFaculties,
  uploadFacultyImage,
  updateFaculty,
  deleteFaculty,
} from '../../api/facultiesApi';
import { toast } from 'sonner';

interface Faculty {
  id: number;
  name: string;
  imgUrl: string;
  departmentCount: number;
  departmentNames: string[];
}

const Faculties = () => {
  const { isOpen, openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [facultyName, setFacultyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 🔹 Fakultetlar ro'yxatini olish
  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });

  // 🔹 File upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadFacultyImage,
    onSuccess: data => {
      setUploadedImageId(data.imgUrl || data.url || data);
      message.success('Rasm muvaffaqiyatli yuklandi!');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Rasm yuklashda xatolik!'
      );
      setFileList([]);
      setUploadedImageId(null);
    },
  });

  // 🔹 Fakultet qo'shish mutation
  const createFacultyMutation = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      toast.success("Fakultet muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      handleCancel();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Fakultet qo'shishda xatolik yuz berdi!"
      );
    },
  });

  // 🔹 Fakultet yangilash mutation
  const updateFacultyMutation = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      toast.success('Fakultet muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      handleCancel();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Fakultet yangilashda xatolik yuz berdi!'
      );
    },
  });

  // 🔹 Fakultet o'chirish mutation
  const deleteFacultyMutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      toast.success("Fakultet muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Fakultet o'chirishda xatolik yuz berdi!"
      );
      setDeletingId(null);
    },
  });

  // 🔹 Dragger props
  const draggerProps = {
    name: 'facultyImage',
    multiple: false,
    fileList: fileList,
    maxCount: 1,
    beforeUpload: async (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Faqat rasm yuklash mumkin!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
        return false;
      }
      setFileList([file as any]);
      uploadImageMutation.mutate(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setUploadedImageId(null);
    },
  };

  // 🔹 Fakultet saqlash/yangilash
  const handleSave = () => {
    if (!facultyName.trim()) {
      message.error('Fakultet nomini kiriting!');
      return;
    }

    const facultyData = {
      name: facultyName,
      imgUrl: uploadedImageId || editingFaculty?.imgUrl || '',
    };

    if (editingFaculty) {
      // Check if any data has changed
      const hasChanges =
        facultyName !== editingFaculty.name ||
        uploadedImageId !== editingFaculty.imgUrl;

      if (!hasChanges) {
        message.info("Hech qanday o'zgarish kiritilmadi!");
        handleCancel();
        return;
      }

      // Yangilash
      updateFacultyMutation.mutate({
        id: editingFaculty.id,
        data: facultyData,
      });
    } else {
      // Yangi qo'shish
      createFacultyMutation.mutate(facultyData);
    }
  };

  // 🔹 Edit tugmasi bosilganda
  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFacultyName(faculty.name);
    setUploadedImageId(faculty.imgUrl);
    openModal();
  };

  // 🔹 Delete tugmasi bosilganda
  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteFacultyMutation.mutate(id);
  };

  // 🔹 Modalni yopish va tozalash
  const handleCancel = () => {
    setFacultyName('');
    setFileList([]);
    setUploadedImageId(null);
    setEditingFaculty(null);
    closeModal();
  };

  // 🔹 Table columns
  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Fakultet nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Bo'limlar soni",
      dataIndex: 'departmentCount',
      key: 'departmentCount',
      width: 150,
    },
    {
      title: 'Rasm',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 100,
      render: (imgUrl: string) =>
        imgUrl && imgUrl !== 'string' ? (
          <Image
            src={imgUrl}
            alt="Faculty"
            className="object-cover rounded"
            width={48}
            height={48}
            preview={{
              mask: "Ko'rish",
            }}
          />
        ) : (
          <span className="text-gray-400">Rasm yo'q</span>
        ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 200,
      render: (_: any, record: Faculty) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Fakultetni o'chirish"
            description="Haqiqatan ham bu fakultetni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={
                deletingId === record.id && deleteFacultyMutation.isPending
              }
            >
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 🔹 Yuqori qism */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 w-1/2">
          <label className="text-gray-700 font-medium whitespace-nowrap">
            Fakultetlar soni: {faculties.length}
          </label>
        </div>
        <div className="flex items-center gap-3 w-1/2">
          <Input
            placeholder="Fakultetni qidirish..."
            type="text"
            className="w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Fakultet qo'shish
          </Button>
        </div>
      </div>
      {/* 🔹 Table */}
      <CustomTable columns={columns} data={faculties} loading={isLoading} />
      {/* 🔹 Modal */}
      <Modal
        title={editingFaculty ? 'Fakultetni tahrirlash' : "Fakultet qo'shish"}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium text-gray-700">Fakultet nomi:</label>
            <Input
              placeholder="Masalan: Suniy intellekt"
              value={facultyName}
              onChange={e => setFacultyName(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium text-gray-700 mb-2 block">
              Rasm yuklash (ixtiyoriy):
            </label>
            {editingFaculty && !fileList.length && editingFaculty.imgUrl && (
              <div className="mb-2">
                <Image
                  src={editingFaculty.imgUrl}
                  alt="Current"
                  className="object-cover rounded"
                  width={96}
                  height={96}
                  preview={{
                    mask: "Ko'rish",
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hozirgi rasm (yangi rasm yuklash uchun faylni tanlang)
                </p>
              </div>
            )}
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Rasmni bu yerga torting yoki faylni tanlang
              </p>
              <p className="ant-upload-hint text-gray-500 text-sm">
                Faqat bitta rasmni yuklashingiz mumkin (max 5MB)
              </p>
            </Dragger>
          </div>
          <Button
            type="primary"
            block
            onClick={handleSave}
            loading={
              createFacultyMutation.isPending ||
              updateFacultyMutation.isPending ||
              uploadImageMutation.isPending
            }
            disabled={!facultyName.trim()}
          >
            {editingFaculty ? 'Yangilash' : 'Saqlash'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Faculties;
