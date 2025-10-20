import { PlusOutlined } from '@ant-design/icons';
import { useModalStore } from '../../stores/useModalStore';
import { PageHeader } from '../../components/ui/PageHeader';
import { useState } from 'react';
import { message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useQuery } from '@tanstack/react-query';
import { getFaculties } from '../../api/facultiesApi';
import { FacultyTable } from './FacultyTable';
import { FacultyModal } from './FacultyModal';
import { useFacultyOperations } from '../../hooks/useFacultyOperation';

interface Faculty {
  id: number;
  name: string;
  imgUrl: string;
  departmentCount: number;
  departmentNames: string[];
}

const Faculties = () => {
  const { isOpen, openModal, closeModal } = useModalStore();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [facultyName, setFacultyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });

  const resetForm = () => {
    setFacultyName('');
    setFileList([]);
    setSelectedFile(null);
    setUploadedImageId(null);
    setEditingFaculty(null);
    closeModal();
  };

  const {
    uploadImageMutation,
    createFacultyMutation,
    updateFacultyMutation,
    deleteFacultyMutation,
  } = useFacultyOperations(resetForm);

  const draggerProps = {
    name: 'facultyImage',
    multiple: false,
    fileList,
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
      // Faqat state ga saqlaymiz, API ga yubormaymiz
      setFileList([file as any]);
      setSelectedFile(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setSelectedFile(null);
      setUploadedImageId(null);
    },
  };

  const handleSave = async () => {
    if (!facultyName.trim()) {
      message.error('Fakultet nomini kiriting!');
      return;
    }

    try {
      let imageUrl = uploadedImageId || editingFaculty?.imgUrl || '';

      // Agar yangi fayl tanlangan bo'lsa, avval uni yuklash
      if (selectedFile) {
        await new Promise<void>((resolve, reject) => {
          uploadImageMutation.mutate(selectedFile, {
            onSuccess: data => {
              imageUrl = data;
              setUploadedImageId(data);
              resolve();
            },
            onError: error => {
              message.error('Rasmni yuklashda xatolik!');
              reject(error);
            },
          });
        });
      }

      const facultyData = {
        name: facultyName,
        imgUrl: imageUrl,
      };

      if (editingFaculty) {
        const hasChanges =
          facultyName !== editingFaculty.name ||
          imageUrl !== editingFaculty.imgUrl;

        if (!hasChanges) {
          message.info("Hech qanday o'zgarish kiritilmadi!");
          resetForm();
          return;
        }

        updateFacultyMutation.mutate({
          id: editingFaculty.id,
          data: facultyData,
        });
      } else {
        createFacultyMutation.mutate(facultyData);
      }
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFacultyName(faculty.name);
    setUploadedImageId(faculty.imgUrl);
    openModal();
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteFacultyMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const isSaving =
    createFacultyMutation.isPending ||
    updateFacultyMutation.isPending ||
    uploadImageMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={faculties.length}
        countLabel="Fakultetlar soni"
        searchPlaceholder="Fakultetni qidirish..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        buttonText="Fakultet qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openModal}
      />

      <FacultyTable
        faculties={faculties}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        isDeleting={deleteFacultyMutation.isPending}
      />

      <FacultyModal
        isOpen={isOpen}
        onCancel={resetForm}
        facultyName={facultyName}
        onFacultyNameChange={setFacultyName}
        editingFaculty={editingFaculty}
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Faculties;
