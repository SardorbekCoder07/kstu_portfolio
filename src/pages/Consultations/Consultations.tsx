import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ConsultationsTable from "./ConsultationsTable";
import consult1 from "../../assets/images/image.png";
import consult2 from "../../assets/images/image.png";
import consult3 from "../../assets/images/image.png";
import ConsultationsModal from "./ConsultationsModal";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

export interface ConsultationItem {
  id: number;
  image: string;
  title: string;
}

const Consultations: React.FC = () => {
  const initialData: ConsultationItem[] = [
    { id: 1, image: consult1, title: "Matematika bo‘yicha maslahat" },
    { id: 2, image: consult2, title: "Geometriya tadqiqotlari bo‘yicha maslahat" },
    { id: 3, image: consult3, title: "Ta’lim metodikasi bo‘yicha maslahat" },
    { id: 4, image: consult1, title: "Differensial tenglamalar bo‘yicha maslahat" },
    { id: 5, image: consult2, title: "Statistika va ehtimollik bo‘yicha maslahat" },
    { id: 6, image: consult3, title: "Kiberxavfsizlik bo‘yicha maslahat" },
  ];

  const [data, setData] = useState<ConsultationItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  // Modal va form state’lari
  const [isOpen, setIsOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<ConsultationItem | null>(null);
  const [consultationName, setConsultationName] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  // Add new consultation
  const handleAdd = () => {
    setEditingConsultation(null);
    setConsultationName("");
    setFileList([]);
    setIsOpen(true);
  };

  // Edit consultation
  const handleEdit = (item: ConsultationItem) => {
    setEditingConsultation(item);
    setConsultationName(item.title);
    setFileList([]); // agar rasm yangilanishi kerak bo‘lsa
    setIsOpen(true);
  };

  // Delete consultation
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu maslahatni o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  // Save consultation (add yoki edit)
  const handleSave = () => {
    if (!consultationName.trim()) return;

    if (editingConsultation) {
      // Edit
      setData(prev =>
        prev.map(item =>
          item.id === editingConsultation.id
            ? { ...item, title: consultationName.trim() }
            : item
        )
      );
    } else {
      // Add
      const newItem: ConsultationItem = {
        id: data.length + 1,
        image: consult1, // default rasm
        title: consultationName.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }

    // Close modal
    resetForm();
  };

  const resetForm = () => {
    setIsOpen(false);
    setEditingConsultation(null);
    setConsultationName("");
    setFileList([]);
  };

  // Dragger props
  const draggerProps: UploadProps = {
    multiple: false,
    beforeUpload: file => {
      setFileList([file]);
      return false; // faylni avtomatik upload qilmaslik
    },
    fileList,
    onRemove: file => {
      setFileList([]);
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Maslahatlar soni"
        searchPlaceholder="Maslahatni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Maslahat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <ConsultationsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Maslahat topilmadi"
        onAdd={handleAdd}
      />

      <ConsultationsModal
        isOpen={isOpen}
        onCancel={resetForm}
        consultationName={consultationName}
        onConsultationNameChange={setConsultationName}
        editingConsultation={
          editingConsultation
            ? { id: editingConsultation.id, name: editingConsultation.title, imgUrl: editingConsultation.image }
            : null
        }
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={false}
      />
    </div>
  );
};

export default Consultations;
