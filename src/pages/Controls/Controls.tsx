import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { PageHeader } from "../../components/ui/PageHeader";
import ControlsTable from "./ControlsTable";
import ControlsModal from "./ControlsModal";

import research1 from "../../assets/images/image.png";
import research2 from "../../assets/images/image.png";
import research3 from "../../assets/images/image.png";

interface ControlItem {
  id: number;
  title: string;
  image: string;
}

const Controls: React.FC = () => {
  /* ================= DATA ================= */
  const initialData: ControlItem[] = [
    { id: 1, image: research1, title: "Algebra va analiz nazoratlari" },
    { id: 2, image: research2, title: "Geometriya va topologiya nazoratlari" },
    { id: 3, image: research3, title: "Matematika ta’lim metodikasi" },
    { id: 4, image: research1, title: "Differensial tenglamalar nazoratlari" },
  ];

  const [data, setData] = useState<ControlItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  /* ================= MODAL STATE ================= */
  const [isOpen, setIsOpen] = useState(false);
  const [controlName, setControlName] = useState("");
  const [editingControl, setEditingControl] = useState<ControlItem | null>(
    null
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setIsOpen(false);
    setControlName("");
    setEditingControl(null);
    setFileList([]);
  };

  const handleAdd = () => {
    setEditingControl(null);
    setControlName("");
    setIsOpen(true);
  };

  const handleEdit = (item: ControlItem) => {
    setEditingControl(item);
    setControlName(item.title);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu nazoratni o‘chirmoqchimisiz?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      if (editingControl) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingControl.id
              ? { ...item, title: controlName }
              : item
          )
        );
      } else {
        const newItem: ControlItem = {
          id: Date.now(),
          title: controlName,
          image: research1,
        };
        setData((prev) => [newItem, ...prev]);
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
        countLabel="Nazoratlar soni"
        searchPlaceholder="Nazorat qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Nazorat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <ControlsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Nazorat topilmadi"
        onAdd={handleAdd}
      />

      <ControlsModal
        isOpen={isOpen}
        onCancel={resetForm}
        controlName={controlName}
        onControlNameChange={setControlName}
        editingControl={
          editingControl
            ? {
                id: editingControl.id,
                name: editingControl.title,
                imgUrl: editingControl.image,
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

export default Controls;
