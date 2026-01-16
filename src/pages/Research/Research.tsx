import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import ResearchTable from "./ResearchTable";
import { ResearchModal } from "./ResearchModal";

import research1 from "../../assets/images/image.png";
import research2 from "../../assets/images/image.png";
import research3 from "../../assets/images/image.png";

interface ResearchItem {
  id: number;
  title: string;
  image: string;
}

const Research: React.FC = () => {
  /* ===================== DATA ===================== */
  const initialData: ResearchItem[] = [
    { id: 1, image: research1, title: "Algebra va analiz tadqiqotlari" },
    { id: 2, image: research2, title: "Geometriya va topologiya tadqiqotlari" },
    { id: 3, image: research3, title: "Matematika ta’lim metodikasi" },
  ];

  const [data, setData] = useState<ResearchItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  /* ===================== MODAL STATE ===================== */
  const [isOpen, setIsOpen] = useState(false);
  const [researchName, setResearchName] = useState("");
  const [editingResearch, setEditingResearch] = useState<ResearchItem | null>(
    null
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /* ===================== SEARCH ===================== */
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  /* ===================== MODAL HELPERS ===================== */
  const resetForm = () => {
    setIsOpen(false);
    setResearchName("");
    setEditingResearch(null);
    setFileList([]);
  };

  const handleAdd = () => {
    setEditingResearch(null);
    setResearchName("");
    setIsOpen(true);
  };

  const handleEdit = (item: ResearchItem) => {
    setEditingResearch(item);
    setResearchName(item.title);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham o‘chirmoqchimisiz?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  /* ===================== SAVE ===================== */
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      if (editingResearch) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingResearch.id
              ? { ...item, title: researchName }
              : item
          )
        );
      } else {
        const newItem: ResearchItem = {
          id: Date.now(),
          title: researchName,
          image: research1,
        };
        setData((prev) => [newItem, ...prev]);
      }

      setIsSaving(false);
      resetForm();
    }, 600);
  };

  /* ===================== UPLOAD ===================== */
  const draggerProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
  };

  /* ===================== UI ===================== */
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
        onButtonClick={handleAdd}
      />

      <ResearchTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Tadqiqot topilmadi"
        onAdd={handleAdd}
      />

      <ResearchModal
        isOpen={isOpen}
        onCancel={resetForm}
        researchName={researchName}
        onResearchNameChange={setResearchName}
        editingResearch={
          editingResearch
            ? {
                id: editingResearch.id,
                name: editingResearch.title,
                imgUrl: editingResearch.image,
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

export default Research;
