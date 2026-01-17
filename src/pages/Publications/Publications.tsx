import React, { useState, useMemo, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import PublicationsTable from "./PublicationsTable";
import PublicationModal, { PublicationFormData } from "./PublicationModal";
import { usePublicationOperations } from "../../hooks/usePublicationOperation";
import { toast } from "sonner";

const INITIAL_FORM: PublicationFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  type: "ARTICLE",
  author: "COAUTHOR",
  degree: "INTERNATIONAL",
  volume: "",
  institution: "",
  popular: false,
};

const Publications: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<any>(null);
  const [formData, setFormData] = useState<PublicationFormData>(INITIAL_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* 🔑 USER_ID ni doimiy va to‘g‘ri olish */
  useEffect(() => {
    const cache = localStorage.getItem("user_cache");
    if (cache) {
      const parsed = JSON.parse(cache);
      setUserId(parsed.id ?? null);
    }
  }, []);

  const {
    publications,
    isPublicationLoading,
    createPublicationMutation,
    updatePublicationMutation,
    deletePublicationMutation,
    uploadPDFMutation,
    refetch,
  } = usePublicationOperations(userId, { enabled: !!userId }); // ❗ USER_ID bo‘lmasa API chaqirilmaydi

  /* 🔎 Faqat shu userga tegishlilar */
  const filteredData = useMemo(() => {
    if (!userId) return [];
    const data = publications.filter((p) => p.userId === userId);
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, publications, userId]);

  const openAddModal = () => {
    setEditingPublication(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingPublication(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      year: item.year || new Date().getFullYear(),
      type: item.type || "ARTICLE",
      author: item.author || "COAUTHOR",
      degree: item.degree || "INTERNATIONAL",
      volume: item.volume || "",
      institution: item.institution || "",
      popular: item.popular || false,
    });
    setFileList([]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingPublication(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);

    try {
      let fileUrl = editingPublication?.fileUrl || "";

      if (fileList.length && fileList[0].originFileObj) {
        fileUrl = await uploadPDFMutation.mutateAsync(
          fileList[0].originFileObj as File
        );
      }

      const payload = {
        ...formData,
        fileUrl,
        userId,
        ...(editingPublication ? { id: editingPublication.id } : {}),
      };

      if (editingPublication) {
        await updatePublicationMutation.mutateAsync(payload);
      } else {
        await createPublicationMutation.mutateAsync(payload);
      }

      closeModal();
      refetch();
    } catch {
      toast.error("Saqlashda xatolik yuz berdi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePublicationMutation.mutateAsync(id);
      refetch();
    } catch {
      toast.error("O‘chirishda xatolik yuz berdi!");
    }
  };

  const draggerProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList),
  };

  if (!userId) {
    return (
      <div className="flex justify-center py-20">
        <span>Loading...</span>
      </div>
    );
  }

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
        onButtonClick={openAddModal}
      />

      <PublicationsTable
        data={filteredData}
        isLoading={isPublicationLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Publikatsiya topilmadi"
      />

      <PublicationModal
        open={isOpen}
        onCancel={closeModal}
        formData={formData}
        onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        editingPublication={editingPublication}
        fileList={fileList}
        onFileChange={setFileList}
        onSubmit={handleSave}
        loading={isSaving}
        draggerProps={draggerProps}
      />
    </div>
  );
};

export default Publications;
