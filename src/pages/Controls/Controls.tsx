import React, { useState, useMemo, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ControlsTable, { ControlItem } from "./ControlsTable";
import ControlsModal, { ControlsFormData, INITIAL_FORM } from "./ControlsModal";
import { Spin } from "antd";
import { toast } from "sonner";
import { useControlOperations } from "../../hooks/useControlOperation";
import type { UploadFile } from "antd/es/upload/interface";

export const INITIAL_CONTROLS_FORM: ControlsFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  univerName: "",
  level: "",
  memberEnum: null,
  finished: false,
};

const Controls: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<ControlItem | null>(
    null
  );
  const [formData, setFormData] = useState<ControlsFormData>(
    INITIAL_CONTROLS_FORM
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /* ================= GET USER_ID ================= */
  useEffect(() => {
    const cache = localStorage.getItem("user_cache");
    if (cache) {
      const parsed = JSON.parse(cache);
      setUserId(parsed.id ?? null);
    }
  }, []);

  /* ================= HOOK ================= */
  const {
    controles,
    isControlLoading,
    createControlMutation,
    updateControlMutation,
    uploadPDFMutation,
    deleteControlMutation,
  } = useControlOperations(userId, { enabled: !!userId });

  /* ================= DATA MAPPING ================= */
  const controlList: ControlItem[] = useMemo(
    () =>
      controles.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        year: item.year,
        fileUrl: item.fileUrl,
        univerName: item.univerName,
        level: item.level,
        memberEnum: item.memberEnum,
        finished: item.finished,
        userId: item.userId,
      })),
    [controles]
  );

  const filteredData = useMemo(() => {
    if (!userId) return [];
    const data = controlList.filter((c) => c.userId === userId);
    if (!searchValue.trim()) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, controlList, userId]);

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setEditingControl(null);
    setFormData(INITIAL_CONTROLS_FORM);
    setFileList([]);
    setIsOpen(true);
  };

  const openEditModal = (item: ControlItem) => {
    setEditingControl(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      year: item.year || new Date().getFullYear(),
      univerName: item.univerName || "",
      level: item.level || "",
      memberEnum: item.memberEnum || null,
      finished: item.finished || false,
    });
    setFileList([]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingControl(null);
    setFormData(INITIAL_CONTROLS_FORM);
    setFileList([]);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!userId) return;

    try {
      let fileUrl = editingControl?.fileUrl || "";
      if (fileList.length) {
        fileUrl = await uploadPDFMutation.mutateAsync(
          fileList[0].originFileObj as File
        );
      }

      const payload = { ...formData, fileUrl, userId, member: true };

      if (editingControl) {
        await updateControlMutation.mutateAsync({
          id: editingControl.id,
          ...payload,
        });
      } else {
        await createControlMutation.mutateAsync(payload);
      }

      closeModal();
    } catch {
      toast.error("Saqlashda xatolik yuz berdi");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id: number) => {
    deleteControlMutation.mutate(id);
  };

  /* ================= UPLOAD ================= */
  const draggerProps = {
    fileList,
    maxCount: 1,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
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
        countLabel="Nazoratlar soni"
        searchPlaceholder="Nazorat qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Nazorat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openAddModal}
      />

      {isControlLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <ControlsTable
          data={filteredData}
          isLoading={false}
          onEdit={openEditModal}
          onDelete={handleDelete}
          deletingId={null}
          isDeleting={false}
          emptyText="Nazorat topilmadi"
        />
      )}

      <ControlsModal
        open={isOpen}
        onCancel={closeModal}
        formData={formData}
        onChange={(key, value) =>
          setFormData((prev) => ({ ...prev, [key]: value }))
        }
        fileList={fileList}
        onFileChange={setFileList}
        onSubmit={handleSave}
        loading={
          createControlMutation.isPending || updateControlMutation.isPending
        }
        editing={!!editingControl}
        draggerProps={draggerProps}
      />
    </div>
  );
};

export default Controls;
