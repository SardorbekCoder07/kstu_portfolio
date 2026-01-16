import React from "react";
import { Button, Input, Modal, Select, Switch, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { TextArea } = Input;

export interface PublicationFormData {
  name: string;
  description?: string;
  year?: number;
  type?: string;
  author?: string;
  degree?: string;
  volume?: string;
  institution?: string;
  popular?: boolean;
}

interface PublicationModalProps {
  open: boolean;
  onCancel: () => void;
  formData: PublicationFormData;
  onChange: <K extends keyof PublicationFormData>(
    key: K,
    value: PublicationFormData[K]
  ) => void;
  editingPublication?: {
    id: number;
    fileUrl?: string;
    imgUrl?: string;
  } | null;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => void;
  loading: boolean;
  draggerProps?: UploadProps;
}

const PublicationModal: React.FC<PublicationModalProps> = ({
  open,
  onCancel,
  formData,
  onChange,
  editingPublication = null,
  fileList,
  onFileChange,
  onSubmit,
  loading,
  draggerProps,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      title={editingPublication ? "Nashrni tahrirlash" : "Nashr qo‘shish"}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <div className="flex flex-col gap-4 mt-3">
        {/* Name */}
        <Input
          placeholder="Nashr nomi"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        {/* Description */}
        <TextArea
          placeholder="Tavsif"
          rows={3}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />

        {/* Year */}
        <Input
          type="number"
          placeholder="Yil"
          value={formData.year}
          onChange={(e) => onChange("year", Number(e.target.value))}
        />

        {/* Type */}
        <Select
          placeholder="Type"
          value={formData.type}
          onChange={(v) => onChange("type", v)}
          options={[
            { label: "ARTICLE", value: "ARTICLE" },
            { label: "BOOK", value: "BOOK" },
            { label: "REPORT", value: "REPORT" },
          ]}
          allowClear
        />

        {/* Author */}
        <Select
          placeholder="Author"
          value={formData.author}
          onChange={(v) => onChange("author", v)}
          options={[
            { label: "COAUTHOR", value: "COAUTHOR" },
            { label: "LEAD", value: "LEAD" },
          ]}
          allowClear
        />

        {/* Degree */}
        <Select
          placeholder="Degree"
          value={formData.degree}
          onChange={(v) => onChange("degree", v)}
          options={[
            { label: "INTERNATIONAL", value: "INTERNATIONAL" },
            { label: "NATIONAL", value: "NATIONAL" },
          ]}
          allowClear
        />

        {/* Volume */}
        <Input
          placeholder="Volume"
          value={formData.volume}
          onChange={(e) => onChange("volume", e.target.value)}
        />

        {/* Institution */}
        <Input
          placeholder="Institution"
          value={formData.institution}
          onChange={(e) => onChange("institution", e.target.value)}
        />

        {/* Popular */}
        <div className="flex items-center gap-3">
          <span>Popular:</span>
          <Switch
            checked={formData.popular}
            onChange={(v) => onChange("popular", v)}
          />
        </div>

        {/* File Upload */}
        <Upload.Dragger
          {...draggerProps}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={(e) => onFileChange(e.fileList)}
          maxCount={1}
          accept=".pdf,image/*"
          className="mt-2"
        >
          <InboxOutlined style={{ fontSize: 32 }} />
          <p className="mt-2">PDF yoki rasm yuklang</p>
        </Upload.Dragger>

        {/* Submit */}
        <Button
          type="primary"
          block
          loading={loading}
          onClick={onSubmit}
          disabled={!formData.name?.trim()}
        >
          {editingPublication ? "Yangilash" : "Saqlash"}
        </Button>
      </div>
    </Modal>
  );
};

export default PublicationModal;
