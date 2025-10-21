import { PlusOutlined } from '@ant-design/icons';
import { useModalStore } from '../../stores/useModalStore';
import { PageHeader } from '../../components/ui/PageHeader';
import { useState, useEffect } from 'react';
import { message, Pagination } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
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
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ✅ Qidiruv state
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Debounce qidiruv
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // ✅ Fakultet operatsiyalari
  const {
    faculties,
    total,
    isFacultiesLoading,
    facultiesError,
    uploadImageMutation,
    createFacultyMutation,
    updateFacultyMutation,
    deleteFacultyMutation,
  } = useFacultyOperations(
    {
      page: currentPage,
      size: pageSize,
      name: debouncedSearch || undefined,
    },
    resetForm
  );

  function resetForm() {
    setFacultyName('');
    setFileList([]);
    setSelectedFile(null);
    setUploadedImageId(null);
    setEditingFaculty(null);
    closeModal();
  }

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
    if (faculty.imgUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: faculty.imgUrl,
        } as UploadFile,
      ]);
    }
    openModal();
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteFacultyMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  // ✅ Pagination o'zgarishi
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  // ✅ Qidiruv o'zgarishi
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const isSaving =
    createFacultyMutation.isPending ||
    updateFacultyMutation.isPending ||
    uploadImageMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={total}
        countLabel="Fakultetlar soni"
        searchPlaceholder="Fakultetni qidirish..."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        buttonText="Fakultet qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={() => {
          resetForm();
          openModal();
        }}
      />

      {/* ✅ Error display */}
      {facultiesError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <strong>Xatolik:</strong>{' '}
          {(facultiesError as any)?.response?.data?.message ||
            "Ma'lumotlarni yuklashda xatolik"}
        </div>
      )}

      {/* ✅ Fakultetlar jadvali */}
      <FacultyTable
        faculties={faculties}
        isLoading={isFacultiesLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        isDeleting={deleteFacultyMutation.isPending}
      />

      {/* ✅ Pagination */}
      {total > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage + 1}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showTotal={total => `Jami: ${total} ta fakultet`}
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}

      {/* Modal */}
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
