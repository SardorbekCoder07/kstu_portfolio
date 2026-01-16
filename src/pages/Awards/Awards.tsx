import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import AwardsTable from "./AwardsTable";
import AwardModal, { AwardFormData } from "./AwardsModal";
import { useAwardOperations } from "../../hooks/useAwardOperation";
import { toast } from "sonner";

const USER_ID = Number(
  JSON.parse(localStorage.getItem("user_cache") || "{}").id
);

const INITIAL_FORM: AwardFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  awardEnum: "LOCAL",
  memberEnum: "INDIVIDUAL",
  fileUrl: "",
};

const Awards: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any>(null);
  const [formData, setFormData] = useState<AwardFormData>(INITIAL_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    awards,
    isAwardLoading,
    createAwardMutation,
    updateAwardMutation,
    deleteAwardMutation,
    uploadPDFMutation,
    refetch,
  } = useAwardOperations(USER_ID);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return awards;
    return awards.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, awards]);

  const openAddModal = () => {
    setEditingAward(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingAward(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      year: item.year || new Date().getFullYear(),
      awardEnum: item.awardEnum || "LOCAL",
      memberEnum: item.memberEnum || "INDIVIDUAL",
      fileUrl: item.fileUrl || "",
    });
    setFileList([]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingAward(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);

    try {
      let fileUrl = editingAward?.fileUrl || "";
      if (fileList.length) {
        fileUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
      }

      const payload = {
        ...formData,
        fileUrl,
        userId: USER_ID,
        ...(editingAward ? { id: editingAward.id } : {}),
      };

      if (editingAward) {
        await updateAwardMutation.mutateAsync(payload);
      } else {
        await createAwardMutation.mutateAsync(payload);
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
    if (!confirm("Haqiqatan ham bu mukofotni o‘chirmoqchimisiz?")) return;
    try {
      await deleteAwardMutation.mutateAsync(id);
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

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Mukofotlar soni"
        searchPlaceholder="Mukofotni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Mukofot qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openAddModal}
      />

      <AwardsTable
        data={filteredData}
        isLoading={isAwardLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        emptyText="Mukofot topilmadi"
      />

      <AwardModal
        open={isOpen}
        onCancel={closeModal}
        formData={formData}
        onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        editingAward={editingAward}
        fileList={fileList}
        onFileChange={setFileList}
        onSubmit={handleSave}
        loading={isSaving}
        draggerProps={draggerProps}
      />
    </div>
  );
};

export default Awards;
