import React from "react";
import { Button, Input, Modal, Upload, Switch } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { TextArea } = Input;

export interface AwardFormData {
  name: string;
  description?: string;
  year?: number;
  awardEnum?: string;
  memberEnum?: string;
  fileUrl?: string;
  popular?: boolean;
}

interface AwardModalProps {
  open: boolean;
  onCancel: () => void;
  formData: AwardFormData;
  onChange: <K extends keyof AwardFormData>(
    key: K,
    value: AwardFormData[K]
  ) => void;
  editingAward?: {
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

const AwardModal: React.FC<AwardModalProps> = ({
  open,
  onCancel,
  formData,
  onChange,
  editingAward = null,
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
      title={editingAward ? "Mukofotni tahrirlash" : "Mukofot qo‘shish"}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <div className="flex flex-col gap-4 mt-3">
        {/* Name */}
        <Input
          placeholder="Mukofot nomi"
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

        {/* Award Type */}
        <Input
          placeholder="Mukofot turi (LOCAL/NATIONAL/INTERNATIONAL)"
          value={formData.awardEnum}
          onChange={(e) => onChange("awardEnum", e.target.value)}
        />

        {/* Member Type */}
        <Input
          placeholder="A’zo turi (INDIVIDUAL/TEAM)"
          value={formData.memberEnum}
          onChange={(e) => onChange("memberEnum", e.target.value)}
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
          {editingAward ? "Yangilash" : "Saqlash"}
        </Button>
      </div>
    </Modal>
  );
};

export default AwardModal;
