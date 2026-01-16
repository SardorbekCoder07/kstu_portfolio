import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import PublicationsTable from "./PublicationsTable";
import PublicationModal, { PublicationFormData } from "./PublicationModal";
import { usePublicationOperations } from "../../hooks/usePublicationOperation";
import { toast } from "sonner";

const USER_ID = Number(
  JSON.parse(localStorage.getItem("user_cache") || "{}").id
);

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
  const [isOpen, setIsOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<any>(null);
  const [formData, setFormData] = useState<PublicationFormData>(INITIAL_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    publications,
    isPublicationLoading,
    createPublicationMutation,
    updatePublicationMutation,
    deletePublicationMutation,
    uploadPDFMutation,
    refetch,
  } = usePublicationOperations(USER_ID);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return publications;
    return publications.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, publications]);

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

      if (fileList.length) {
        fileUrl = await uploadPDFMutation.mutateAsync(
          fileList[0].originFileObj as File
        );
      }

      const payload = {
        ...formData,
        fileUrl,
        userId: USER_ID,
        ...(editingPublication ? { id: editingPublication.id } : {}),
      };

      if (editingPublication) {
        await updatePublicationMutation.mutateAsync(payload);
      } else {
        await createPublicationMutation.mutateAsync(payload);
      }

      closeModal();
      refetch();
    } catch (error) {
      toast.error("Saqlashda xatolik yuz berdi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham bu publikatsiyani o‘chirmoqchimisiz?")) return;
    try {
      await deletePublicationMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      toast.error("O‘chirishda xatolik yuz berdi!");
    }
  };

  const draggerProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList),
  };

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
