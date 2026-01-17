import React, { useState, useMemo, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ConsultationsTable, { ConsultationItem } from "./ConsultationsTable";
import ConsultationsModal, { ConsultationFormData, INITIAL_CONSULTATION_FORM } from "./ConsultationsModal";
import { Spin, UploadFile } from "antd";
import { toast } from "sonner";
import { useAdviceOperations } from "../../hooks/useAdviceOperation";

const Consultations: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<ConsultationItem | null>(null);
  const [formData, setFormData] = useState<ConsultationFormData>(INITIAL_CONSULTATION_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /* ================= USER_ID ================= */
  useEffect(() => {
    const cache = localStorage.getItem("user_cache");
    if (cache) {
      const parsed = JSON.parse(cache);
      setUserId(parsed.id ?? null);
    }
  }, []);

  const {
    advices,
    isAdviceLoading: isConsultationLoading,
    createAdviceMutation,
    updateAdviceMutation,
    deleteAdviceMutation,
    uploadPDFMutation,
  } = useAdviceOperations(userId, { enabled: !!userId });

  /* ================= FILTERED DATA ================= */
  const consultationList: ConsultationItem[] = useMemo(
    () =>
      advices.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        year: item.year,
        fileUrl: item.fileUrl,
        type: item.type,
        author: item.author,
        degree: item.degree,
        volume: item.volume,
        institution: item.institution,
        popular: item.popular,
        userId: item.userId,
      })),
    [advices]
  );

  const filteredData = useMemo(() => {
    if (!userId) return [];
    const data = consultationList.filter((c) => c.userId === userId);
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, consultationList, userId]);

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setEditingConsultation(null);
    setFormData(INITIAL_CONSULTATION_FORM);
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: ConsultationItem) => {
    setEditingConsultation(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      year: item.year || new Date().getFullYear(),
      fileUrl: item.fileUrl || "",
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
    setEditingConsultation(null);
    setFormData(INITIAL_CONSULTATION_FORM);
    setFileList([]);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error("Maslahat nomi bo‘sh bo‘lmasligi kerak!");
    if (!userId) return;

    try {
      let fileUrl = editingConsultation?.fileUrl || "";

      if (fileList.length && fileList[0].originFileObj) {
        fileUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
      }

      const payload = {
        name: formData.title,
        description: formData.description,
        year: formData.year,
        fileUrl,
        type: formData.type,
        author: formData.author,
        degree: formData.degree,
        volume: formData.volume,
        institution: formData.institution,
        popular: formData.popular,
        userId,
      };

      if (editingConsultation) {
        await updateAdviceMutation.mutateAsync({ id: editingConsultation.id, ...payload });
      } else {
        await createAdviceMutation.mutateAsync(payload);
      }

      closeModal();
    } catch {
      toast.error("Saqlashda xatolik yuz berdi!");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await deleteAdviceMutation.mutateAsync(id);
    } catch {
      toast.error("O‘chirishda xatolik yuz berdi!");
    }
  };

  /* ================= UPLOAD ================= */
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
        countLabel="Maslahatlar soni"
        searchPlaceholder="Maslahatni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Maslahat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openAddModal}
      />

      {isConsultationLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <ConsultationsTable
          data={filteredData}
          isLoading={false}
          onEdit={openEditModal}
          onDelete={handleDelete}
          deletingId={null}
          isDeleting={false}
          emptyText="Maslahat topilmadi"
        />
      )}

      <ConsultationsModal
        open={isOpen}
        onCancel={closeModal}
        formData={formData}
        onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        fileList={fileList}
        onFileChange={setFileList}
        onSubmit={handleSave}
        loading={createAdviceMutation.isPending || updateAdviceMutation.isPending}
        editing={!!editingConsultation}
        draggerProps={draggerProps}
      />
    </div>
  );
};

export default Consultations;
