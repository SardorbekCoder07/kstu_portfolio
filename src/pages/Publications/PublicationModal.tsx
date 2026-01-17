import React, { useEffect } from "react";
import { Modal, Button, Input, Select, Form, Upload, message, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Title } = Typography;

// ✅ API enum tiplari va o‘zbekcha label
const PublicationTypeOptions = [
  { value: "ARTICLE", label: "Maqola" },
  { value: "BOOK", label: "Kitob" },
  { value: "PROCEEDING", label: "Konferensiya maqolasi" },
  { value: "OTHERS", label: "Boshqa" },
];

const AuthorOptions = [
  { value: "COAUTHOR", label: "Ham muallif" },
  { value: "FIRST_AUTHOR", label: "Birinchi muallif" },
  { value: "BOTH_AUTHOR", label: "Ikkala muallif" },
];

const DegreeOptions = [
  { value: "INTERNATIONAL", label: "Xalqaro" },
  { value: "NATIONAL", label: "Milliy" },
];

export interface PublicationFormData {
  name: string;
  description?: string;
  year?: number;
  type?: string;
  author?: string;
  degree?: string;
  volume?: string;
  institution?: string;
  fileUrl?: string;
}

interface PublicationModalProps {
  open: boolean;
  onCancel: () => void;
  formData: PublicationFormData;
  onChange: <K extends keyof PublicationFormData>(key: K, value: PublicationFormData[K]) => void;
  editingPublication?: { id: number; fileUrl?: string } | null;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => Promise<void>;
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
  const [form] = Form.useForm();

  const pdfUrlRegex = /^(https?:\/\/[^\s]+\.pdf)$/i;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(formData);
      if (formData.fileUrl) {
        onFileChange([
          {
            uid: "-1",
            name: formData.fileUrl.split("/").pop() || "file.pdf",
            status: "done",
            url: formData.fileUrl,
          },
        ]);
      } else {
        onFileChange([]);
      }
    }
  }, [open, formData, form, onFileChange]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (values.fileUrl && !pdfUrlRegex.test(values.fileUrl)) {
        message.error("Iltimos, to‘g‘ri PDF havolasini kiriting!");
        return;
      }

      await onSubmit();
    } catch (err) {
      console.error("Form validation error:", err);
    }
  };

  const uploadProps: UploadProps = {
    accept: ".pdf,image/*",
    maxCount: 1,
    fileList,
    onRemove: () => {
      onFileChange([]);
      return true;
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const validType = /(pdf|jpg|jpeg|png)$/i.test(file.name);
      if (!isLt10M) {
        message.error("Fayl hajmi 10MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }
      if (!validType) {
        message.error("Faqat PDF yoki rasm formatdagi fayllar ruxsat etilgan!");
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
      title={<Title level={4}>{editingPublication ? "Nashrni tahrirlash" : "Yangi nashr qo‘shish"}</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* Name */}
        <Form.Item
          name="name"
          label="Nashr nomi"
          rules={[{ required: true, message: "Iltimos, nomini kiriting!" }]}
        >
          <Input
            size="large"
            placeholder="Nashr nomi..."
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Tavsif"
          rules={[{ required: true, message: "Iltimos, tavsif kiriting!" }]}
        >
          <TextArea
            rows={3}
            placeholder="Tavsif kiriting..."
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Form.Item>

        {/* Year */}
        <Form.Item
          name="year"
          label="Yil"
          rules={[{ required: true, message: "Iltimos, yilni kiriting!" }]}
        >
          <Input
            type="number"
            placeholder="2024"
            size="large"
            onChange={(e) => onChange("year", Number(e.target.value))}
          />
        </Form.Item>

        {/* Type */}
        <Form.Item
          name="type"
          label="Turi"
          rules={[{ required: true, message: "Iltimos, turini tanlang!" }]}
        >
          <Select
            placeholder="Turi"
            size="large"
            value={formData.type}
            onChange={(v) => onChange("type", v)}
            allowClear
          >
            {PublicationTypeOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Author */}
        <Form.Item
          name="author"
          label="Muallif"
          rules={[{ required: true, message: "Iltimos, muallifni tanlang!" }]}
        >
          <Select
            placeholder="Muallif"
            size="large"
            value={formData.author}
            onChange={(v) => onChange("author", v)}
            allowClear
          >
            {AuthorOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Degree */}
        <Form.Item
          name="degree"
          label="Daraja"
          rules={[{ required: true, message: "Iltimos, darajani tanlang!" }]}
        >
          <Select
            placeholder="Daraja"
            size="large"
            value={formData.degree}
            onChange={(v) => onChange("degree", v)}
            allowClear
          >
            {DegreeOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Volume */}
        <Form.Item
          name="volume"
          label="Jild / Hajmi"
          rules={[{ required: true, message: "Iltimos, jild/hajmni kiriting!" }]}
        >
          <Input
            placeholder="Volume"
            value={formData.volume}
            onChange={(e) => onChange("volume", e.target.value)}
          />
        </Form.Item>

        {/* Institution */}
        <Form.Item
          name="institution"
          label="Tashkilot / Universitet"
          rules={[{ required: true, message: "Iltimos, tashkilot/universitetni kiriting!" }]}
        >
          <Input
            placeholder="Tashkilot yoki universitet"
            value={formData.institution}
            onChange={(e) => onChange("institution", e.target.value)}
          />
        </Form.Item>

        {/* File Upload */}
        <Form.Item label="PDF yoki rasm yuklash (ixtiyoriy)">
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Faylni yuklash uchun bosing yoki sudrab keling</p>
            <p className="ant-upload-hint">Faqat PDF yoki rasm format. Maksimal hajm: 10MB</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Fayl URL */}
        <Form.Item name="fileUrl" label="Yoki fayl havolasi">
          <Input
            placeholder="https://example.com/file.pdf"
            size="large"
            disabled={fileList.length > 0}
            onChange={(e) => onChange("fileUrl", e.target.value)}
          />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {editingPublication ? "Yangilash" : "Saqlash"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PublicationModal;
