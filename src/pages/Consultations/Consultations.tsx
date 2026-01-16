import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ConsultationsTable, { ConsultationItem } from "./ConsultationsTable";
import ConsultationsModal, { ConsultationFormData, INITIAL_FORM } from "./ConsultationsModal";
import { Spin, UploadFile } from "antd";
import { toast } from "sonner";
import { useAdviceOperations } from "../../hooks/useAdviceOperation"; // hook mavjud deb hisoblaymiz

// LocalStorage dan user id olish
const dataId = JSON.parse(localStorage.getItem("user_cache") || "{}");
const USER_ID = dataId?.id || 0;

export const INITIAL_CONSULTATION_FORM: ConsultationFormData = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  fileUrl: "",
};

const Consultations: React.FC = () => {
  const {
    advices,
    isAdviceLoading: isConsultationLoading,
    createAdviceMutation,
    updateAdviceMutation,
    deleteAdviceMutation,
    uploadPDFMutation,
  } = useAdviceOperations(USER_ID);

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<ConsultationItem | null>(null);
  const [formData, setFormData] = useState<ConsultationFormData>(INITIAL_CONSULTATION_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /* ================= DATA MAPPING ================= */
  const consultationList: ConsultationItem[] = useMemo(
    () =>
      advices.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        year: item.year,
        fileUrl: item.fileUrl,
      })),
    [advices]
  );

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return consultationList;
    return consultationList.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, consultationList]);

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
    if (!formData.title.trim()) return;

    try {
      let fileUrl = editingConsultation?.fileUrl || "";

      if (fileList.length) {
        fileUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
      }

      const payload = { ...formData, fileUrl, userId: USER_ID };

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
