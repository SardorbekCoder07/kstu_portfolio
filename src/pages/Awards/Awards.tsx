import React, { useState, useMemo, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import AwardsTable from "./AwardsTable";
import {AwardModal, AwardFormData, INITIAL_AWARD_FORM } from "./AwardsModal";
import { useAwardOperations } from "../../hooks/useAwardOperation";
import { toast } from "sonner";

const Awards: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardFormData | null>(null);
  const [formData, setFormData] = useState<AwardFormData>(INITIAL_AWARD_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // USER_ID olish
  useEffect(() => {
    const cache = localStorage.getItem("user_cache");
    if (cache) {
      const parsed = JSON.parse(cache);
      setUserId(parsed.id ?? null);
    }
  }, []);

  const {
    awards,
    isAwardLoading,
    createAwardMutation,
    updateAwardMutation,
    deleteAwardMutation,
    uploadPDFMutation,
    refetch,
  } = useAwardOperations(userId, { enabled: !!userId });

  const filteredData = useMemo(() => {
    if (!userId) return [];
    const data = awards.filter((a) => a.userId === userId);
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, awards, userId]);

  const openAddModal = () => {
    setEditingAward(null);
    setFormData({ ...INITIAL_AWARD_FORM, userId: userId || 0 });
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: AwardFormData) => {
    setEditingAward(item);
    setFormData({ ...item });
    setFileList(
      item.fileUrl
        ? [
            {
              uid: "-1",
              name: item.fileUrl.split("/").pop() || "file.pdf",
              status: "done",
              url: item.fileUrl,
              originFileObj: undefined,
            },
          ]
        : []
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingAward(null);
    setFormData(INITIAL_AWARD_FORM);
    setFileList([]);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);

    try {
      let fileUrl = editingAward?.fileUrl || "";
      if (fileList.length && fileList[0].originFileObj) {
        fileUrl = await uploadPDFMutation.mutateAsync(
          fileList[0].originFileObj as File
        );
      }

      const payload: AwardFormData = {
        ...formData,
        fileUrl,
        userId: userId || 0,
      };

      if (editingAward) {
        await updateAwardMutation.mutateAsync({ id: editingAward.id, ...payload });
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
      />
    </div>
  );
};

export default Awards;
