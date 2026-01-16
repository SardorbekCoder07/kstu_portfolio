import React, { useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ResearchTable, { ResearchItem } from "./ResearchTable";
import { ResearchModal, ResearchFormData, INITIAL_FORM } from "./ResearchModal";
import { useResearchOperations } from "../../hooks/useResearchOperation";
import type { UploadFile } from "antd/es/upload/interface";
import { Spin } from "antd";
import { toast } from "sonner";

const dataId = JSON.parse(localStorage.getItem("user_cache") || "{}");
const USER_ID = dataId.id;

const Research: React.FC = () => {
  const {
    researches,
    isResearchLoading,
    createResearchMutation,
    updateResearchMutation,
    uploadPDFMutation,
  } = useResearchOperations(USER_ID);

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<ResearchItem | null>(null);
  const [formData, setFormData] = useState<ResearchFormData>(INITIAL_FORM);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const researchList: ResearchItem[] = useMemo(
    () =>
      researches.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        year: item.year,
        univerName: item.univerName,
        memberEnum: item.memberEnum,
        finished: item.finished,
        fileUrl: item.fileUrl,
      })),
    [researches]
  );

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return researchList;
    return researchList.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, researchList]);

  const openAddModal = () => {
    setEditingResearch(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: ResearchItem) => {
    setEditingResearch(item);
    setFormData({
      name: item.title,
      description: item.description,
      year: item.year,
      univerName: item.univerName,
      memberEnum: item.memberEnum,
      finished: item.finished,
    });
    setFileList([]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingResearch(null);
    setFormData(INITIAL_FORM);
    setFileList([]);
  };

  const handleSave = async () => {
    try {
      let fileUrl = editingResearch?.fileUrl || "";

      if (fileList.length && fileList[0].originFileObj) {
        fileUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        year: formData.year,
        univerName: formData.univerName,
        memberEnum: formData.memberEnum,
        finished: formData.finished,
        fileUrl,
        userId: USER_ID,
        member: true,
      };

      if (editingResearch) {
        await updateResearchMutation.mutateAsync({ id: editingResearch.id, ...payload });
      } else {
        await createResearchMutation.mutateAsync(payload);
      }

      closeModal();
    } catch {
      toast.error("Saqlashda xatolik yuz berdi!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Tadqiqotlar soni"
        searchPlaceholder="Tadqiqot qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Tadqiqot qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openAddModal}
      />

      {isResearchLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <ResearchTable
          data={filteredData}
          isLoading={false}
          onEdit={openEditModal}
          onDelete={() => {}}
          deletingId={null}
          isDeleting={false}
        />
      )}

      <ResearchModal
        open={isOpen}
        onCancel={closeModal}
        formData={formData}
        onChange={(key, value) => setFormData(prev => ({ ...prev, [key]: value }))}
        fileList={fileList}
        onFileChange={setFileList}
        onSubmit={handleSave}
        loading={createResearchMutation.isPending || updateResearchMutation.isPending}
        editing={!!editingResearch}
      />
    </div>
  );
};

export default Research;
