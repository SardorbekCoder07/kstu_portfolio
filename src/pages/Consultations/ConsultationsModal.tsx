import React from "react";
import { Modal, Button, Form, Input, Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export interface ConsultationFormData {
  title: string;
  description?: string;
  year: number;
  imgUrl?: string;
  fileUrl?: string;
}

export const INITIAL_FORM: ConsultationFormData = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  imgUrl: "",
  fileUrl: "",
};

interface ConsultationsModalProps {
  open: boolean;
  onCancel: () => void;
  formData: ConsultationFormData;
  onChange: <K extends keyof ConsultationFormData>(
    key: K,
    value: ConsultationFormData[K]
  ) => void;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => void;
  loading: boolean;
  editing?: boolean;
  draggerProps?: UploadProps;
}

const ConsultationsModal: React.FC<ConsultationsModalProps> = ({
  open,
  onCancel,
  formData,
  onChange,
  fileList,
  onFileChange,
  onSubmit,
  loading,
  editing = false,
  draggerProps,
}) => {
  const [form] = Form.useForm();

  const internalDraggerProps: UploadProps = {
    accept: "image/*,.pdf",
    maxCount: 1,
    fileList,
    onRemove: () => {
      onFileChange([]);
      return true;
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        alert("Fayl hajmi 10MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }
      onFileChange([
        {
          uid: Date.now().toString(),
          name: file.name,
          status: "done",
          size: file.size,
          type: file.type,
          originFileObj: file,
        },
      ]);
      return false;
    },
    ...draggerProps,
  };

  return (
    <Modal
      title={
        <Title level={4}>
          {editing ? "Maslahatni tahrirlash" : "Yangi maslahat qo‘shish"}
        </Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
      centered
      className="rounded-xl"
    >
      <Form form={form} layout="vertical" initialValues={formData}>
        <Form.Item
          name="title"
          label="Maslahat nomi"
          rules={[{ required: true, message: "Maslahat nomini kiriting!" }]}
        >
          <Input
            placeholder="Masalan: Oraliq maslahat (1-semestr)"
            size="large"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </Form.Item>

        <Form.Item name="description" label="Tavsif (ixtiyoriy)">
          <TextArea
            rows={3}
            placeholder="Maslahat tavsifini kiriting..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Rasm yoki PDF yuklash (ixtiyoriy)">
          <Upload.Dragger {...internalDraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Faylni yuklash uchun bosing yoki sudrab keling
            </p>
            <p className="ant-upload-hint text-gray-500">
              Faqat PDF yoki rasm format. Maksimal hajm: 10MB
            </p>
          </Upload.Dragger>
        </Form.Item>

        {formData.imgUrl && !fileList.length && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Hozirgi rasm</p>
            <img
              src={formData.imgUrl}
              alt="Current"
              className="w-24 h-24 object-cover rounded"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            {editing ? "Yangilash" : "Saqlash"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ConsultationsModal;
