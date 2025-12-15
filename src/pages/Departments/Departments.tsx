import { PageHeader } from '../../components/ui/PageHeader';
import { PlusOutlined } from '@ant-design/icons';
import { FacultyTable } from '../Faculties/FacultyTable';
import { useState, useEffect } from 'react';
import { DepartmentModal } from './DepartmentModal';
import { useModalStore } from '../../stores/useModalStore';
import { useQuery } from '@tanstack/react-query';
import {
  getAllFaculties,
  uploadFacultyImage,
} from '../../api/pagesApi/facultiesApi';
import { useMutation } from '@tanstack/react-query';
import { useDepartmentOperations } from '../../hooks/useDepartmentOperation';
import { toast } from 'sonner';
import { Pagination } from 'antd';

const Departments = () => {
  const { isOpen, openModal, closeModal } = useModalStore();
  const [departmentName, setDepartmentName] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ✅ Qidiruv state
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Debounce qidiruv (yozish tugaguncha kutish)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(0); // Qidirganda 1-sahifaga qaytish
    }, 500); // 500ms kutish

    return () => clearTimeout(timer);
  }, [searchValue]);

  // ✅ Fakultetlarni olish
  const { data: faculties = [] } = useQuery({
    queryKey: ['all-faculties'], // ✅ boshqa key
    queryFn: getAllFaculties, // ✅ getAllFaculties ishlatish
  });

  // ✅ Kafedra operatsiyalari
  const {
    departments,
    total,
    isDepartmentsLoading,
    departmentsError,
    createDepartmentMutation,
    updateDepartmentMutation,
    deleteDepartmentMutation,
  } = useDepartmentOperations(
    {
      page: currentPage,
      size: pageSize,
      name: debouncedSearch || undefined, // ✅ name parametri
    },
    () => {
      resetForm();
      closeModal();
    }
  );

  // ✅ Rasm yuklash mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadFacultyImage,
  });

  // ✅ Dragger props
  const draggerProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file: File) => {
      setSelectedFile(file);
      return false;
    },
    fileList,
    onChange: (info: any) => setFileList(info.fileList),
  };

  // ✅ Formani tozalash
  const resetForm = () => {
    setDepartmentName('');
    setSelectedFacultyId(null);
    setFileList([]);
    setSelectedFile(null);
    setUploadedImageId(null);
    setEditingDepartment(null);
  };

  // ✅ Saqlash funksiyasi
  const handleSave = async () => {
    if (!departmentName.trim()) {
      toast.error('Kafedra nomini kiriting!');
      return;
    }

    if (!selectedFacultyId) {
      toast.error('Fakultetni tanlang!');
      return;
    }

    try {
      let imageUrl = uploadedImageId || editingDepartment?.imgUrl || '';

      if (selectedFile) {
        await new Promise<void>((resolve, reject) => {
          uploadImageMutation.mutate(selectedFile, {
            onSuccess: data => {
              imageUrl = data;
              setUploadedImageId(data);
              resolve();
            },
            onError: error => {
              toast.error('Rasmni yuklashda xatolik!');
              reject(error);
            },
          });
        });
      }

      const departmentData = {
        name: departmentName,
        imgUrl: imageUrl,
        collegeId: selectedFacultyId,
      };

      if (editingDepartment) {
        const hasChanges =
          departmentName !== editingDepartment.name ||
          imageUrl !== editingDepartment.imgUrl ||
          selectedFacultyId !== editingDepartment.collegeId;

        if (!hasChanges) {
          toast.info("Hech qanday o'zgarish kiritilmadi!");
          resetForm();
          closeModal();
          return;
        }

        updateDepartmentMutation.mutate({
          id: editingDepartment.id,
          data: departmentData,
        });
      } else {
        createDepartmentMutation.mutate(departmentData);
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department: any) => {
    
    setEditingDepartment(department);
    setDepartmentName(department.name);
    setSelectedFacultyId(department.collegeId);
    setUploadedImageId(department.imgUrl);
    if (department.imgUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: department.imgUrl,
        },
      ]);
    }
    openModal();
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteDepartmentMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={total}
        countLabel="Kafedralar soni"
        searchPlaceholder="Kafedrani qidirish..."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        buttonText="Kafedra qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={() => {
          resetForm();
          openModal();
        }}
      />

      {departmentsError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <strong>Xatolik:</strong>{' '}
          {(departmentsError as any)?.response?.data?.message ||
            "Ma'lumotlarni yuklashda xatolik"}
        </div>
      )}

      {/* ✅ Kafedralar jadvali */}
      <FacultyTable
        faculties={departments}
        isLoading={isDepartmentsLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        isDeleting={deleteDepartmentMutation.isPending}
        isKafedra={true}
        emptyText="Kafedra topilmadi"
        text="Kafedra"
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
            showTotal={total => `Jami: ${total} ta kafedra`}
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}

      {/* ✅ Department Modal */}
      <DepartmentModal
        isOpen={isOpen}
        onCancel={() => {
          resetForm();
          closeModal();
        }}
        departmentName={departmentName}
        onDepartmentNameChange={setDepartmentName}
        selectedFacultyId={selectedFacultyId}
        onFacultySelect={setSelectedFacultyId}
        faculties={faculties}
        editingDepartment={editingDepartment}
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={
          createDepartmentMutation.isPending ||
          updateDepartmentMutation.isPending ||
          uploadImageMutation.isPending
        }
      />
    </div>
  );
};

export default Departments;
