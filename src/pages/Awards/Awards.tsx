import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import AwardsTable from "./AwardsTable";
import AwardsModal from "./AwardsModal";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

import award1 from "../../assets/images/image.png";
import award2 from "../../assets/images/image.png";
import award3 from "../../assets/images/image.png";

interface AwardItem {
  id: number;
  image: string;
  title: string;
}

const Awards: React.FC = () => {
  /** ===================== DATA ===================== */
  const initialData: AwardItem[] = [
    { id: 1, image: award1, title: "Matematika bo‘yicha mukofot" },
    { id: 2, image: award2, title: "Geometriya tadqiqotlari mukofoti" },
    { id: 3, image: award3, title: "Ta’lim metodikasi mukofoti" },
    { id: 4, image: award1, title: "Differensial tenglamalar bo‘yicha mukofot" },
    { id: 5, image: award2, title: "Statistika va ehtimollik mukofoti" },
    { id: 6, image: award3, title: "Kiberxavfsizlik mukofoti" },
  ];

  const [data, setData] = useState<AwardItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  /** ===================== MODAL STATES ===================== */
  const [isOpen, setIsOpen] = useState(false);
  const [awardName, setAwardName] = useState("");
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /** ===================== SEARCH ===================== */
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  /** ===================== MODAL HELPERS ===================== */
  const openAddModal = () => {
    setEditingAward(null);
    setAwardName("");
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: AwardItem) => {
    setEditingAward(item);
    setAwardName(item.title);
    setFileList([]);
    setIsOpen(true);
  };

  const resetForm = () => {
    setIsOpen(false);
    setAwardName("");
    setEditingAward(null);
    setFileList([]);
  };

  /** ===================== SAVE ===================== */
  const handleSave = () => {
    if (!awardName.trim()) return;

    setIsSaving(true);

    setTimeout(() => {
      if (editingAward) {
        setData(prev =>
          prev.map(item =>
            item.id === editingAward.id
              ? { ...item, title: awardName.trim() }
              : item
          )
        );
      } else {
        const newItem: AwardItem = {
          id: Date.now(),
          title: awardName.trim(),
          image: award1,
        };
        setData(prev => [newItem, ...prev]);
      }

      setIsSaving(false);
      resetForm();
    }, 500);
  };

  /** ===================== DELETE ===================== */
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu mukofotni o‘chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  /** ===================== UPLOAD ===================== */
  const draggerProps: UploadProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: info => setFileList(info.fileList),
  };

  /** ===================== RENDER ===================== */
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
        isLoading={false}
        onEdit={openEditModal}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Mukofot topilmadi"
        onAdd={openAddModal}
      />

      <AwardsModal
        isOpen={isOpen}
        onCancel={resetForm}
        awardName={awardName}
        onAwardNameChange={setAwardName}
        editingAward={
          editingAward
            ? { id: editingAward.id, name: editingAward.title, imgUrl: editingAward.image }
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

export default Awards;
