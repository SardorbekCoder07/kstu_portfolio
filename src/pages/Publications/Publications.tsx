import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import PublicationsTable from "./PublicationsTable";
import PublicationModal from "./PublicationModal";

import pub1 from "../../assets/images/image.png";
import pub2 from "../../assets/images/image.png";
import pub3 from "../../assets/images/image.png";

interface PublicationItem {
  id: number;
  title: string;
  image: string;
}

const Publications: React.FC = () => {
  /* ================= DATA ================= */
  const initialData: PublicationItem[] = [
    { id: 1, image: pub1, title: "Algebra bo‘yicha maqola" },
    { id: 2, image: pub2, title: "Geometriya va topologiya tadqiqoti" },
    { id: 3, image: pub3, title: "Statistika va ehtimollik maqolasi" },
  ];

  const [data, setData] = useState<PublicationItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  /* ================= MODAL STATE ================= */
  const [isOpen, setIsOpen] = useState(false);
  const [publicationName, setPublicationName] = useState("");
  const [editingPublication, setEditingPublication] =
    useState<PublicationItem | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setIsOpen(false);
    setPublicationName("");
    setEditingPublication(null);
    setFileList([]);
  };

  const handleAdd = () => {
    setEditingPublication(null);
    setPublicationName("");
    setIsOpen(true);
  };

  const handleEdit = (item: PublicationItem) => {
    setEditingPublication(item);
    setPublicationName(item.title);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu publikatsiyani o‘chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      if (editingPublication) {
        setData(prev =>
          prev.map(item =>
            item.id === editingPublication.id
              ? { ...item, title: publicationName }
              : item
          )
        );
      } else {
        const newItem: PublicationItem = {
          id: Date.now(),
          title: publicationName,
          image: pub1,
        };
        setData(prev => [newItem, ...prev]);
      }

      setIsSaving(false);
      resetForm();
    }, 600);
  };

  /* ================= UPLOAD ================= */
  const draggerProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Publikatsiyalar soni"
        searchPlaceholder="Publikatsiya qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Publikatsiya qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <PublicationsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Publikatsiya topilmadi"
        onAdd={handleAdd}
      />

      <PublicationModal
        isOpen={isOpen}
        onCancel={resetForm}
        publicationName={publicationName}
        onPublicationNameChange={setPublicationName}
        editingPublication={
          editingPublication
            ? {
                id: editingPublication.id,
                name: editingPublication.title,
                imgUrl: editingPublication.image,
              }
            : null
        }
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Publications;
