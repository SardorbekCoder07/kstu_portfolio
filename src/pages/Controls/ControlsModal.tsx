import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Upload,
  Typography,
  Form,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export interface ControlsFormData {
  name: string;
  description: string;
  year: number;
  univerName: string;
  level: string;
  memberEnum: "MILLIY" | "XALQARO" | null;
  finished: boolean;
  fileUrl?: string;
}

export const INITIAL_CONTROLS_FORM: ControlsFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  univerName: "",
  level: "",
  memberEnum: null,
  finished: false,
  fileUrl: "",
};

interface ControlsModalProps {
  open: boolean;
  onCancel: () => void;
  formData: ControlsFormData;
  onChange: <K extends keyof ControlsFormData>(
    key: K,
    value: ControlsFormData[K]
  ) => void;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  editing?: boolean;
  draggerProps?: UploadProps;
}

const ControlsModal: React.FC<ControlsModalProps> = ({
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

  const [internalLoading, setInternalLoading] = useState(false);
  // PDF havolani tekshirish regex
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
      const values = await form.validateFields();

      if (values.fileUrl && !pdfUrlRegex.test(values.fileUrl)) {
        message.error("Iltimos, to‘g‘ri PDF havolasini kiriting!");
        return;
      }

      setInternalLoading(true); // ✅ submit boshlanishida
      await onSubmit();
      setInternalLoading(false); // ✅ submit tugagach
    } catch (err) {
      console.error("Form validation error:", err);
      setInternalLoading(false);
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
      title={
        <Title level={4}>
          {editing ? "Nazoratni tahrirlash" : "Yangi nazorat qo'shish"}
        </Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* Nazorat nomi */}
        <Form.Item
          name="name"
          label="Nazorat nomi"
          rules={[{ required: true, message: "Iltimos, nomini kiriting!" }]}
        >
          <Input
            size="large"
            placeholder="Nazorat nomi..."
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Form.Item>

        {/* Tavsif */}
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

        {/* Yil va Universitet */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="year"
            label="Yil"
            rules={[{ required: true, message: "Iltimos, yilni kiriting!" }]}
          >
            <Input
              type="number"
              size="large"
              placeholder="2024"
              onChange={(e) => onChange("year", Number(e.target.value))}
            />
          </Form.Item>

          <Form.Item
            name="univerName"
            label="Universitet / Tashkilot"
            rules={[
              { required: true, message: "Iltimos, universitetni kiriting!" },
            ]}
          >
            <Input
              placeholder="TATU, INHA..."
              size="large"
              onChange={(e) => onChange("univerName", e.target.value)}
            />
          </Form.Item>
        </div>

        {/* Daraja va A’zolik turi */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="level"
            label="Daraja"
            rules={[{ required: true, message: "Iltimos, darajani kiriting!" }]}
          >
            <Input
              placeholder="Boshlang‘ich, Magistr..."
              size="large"
              onChange={(e) => onChange("level", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="memberEnum"
            label="A’zolik turi"
            rules={[
              { required: true, message: "Iltimos, a’zolik turini tanlang!" },
            ]}
          >
            <Select
              placeholder="Milliy yoki Xalqaro"
              size="large"
              value={formData.memberEnum}
              onChange={(val) => onChange("memberEnum", val)}
            >
              <Select.Option value="MILLIY">Milliy</Select.Option>
              <Select.Option value="XALQARO">Xalqaro</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Holati */}
        <Form.Item
          name="finished"
          label="Holati"
          rules={[{ required: true, message: "Iltimos, holatini tanlang!" }]}
        >
          <Select
            size="large"
            value={formData.finished}
            onChange={(val) => onChange("finished", val)}
          >
            <Select.Option value={false}>Jarayonda</Select.Option>
            <Select.Option value={true}>Tugallangan</Select.Option>
          </Select>
        </Form.Item>

        {/* File Upload */}
        <Form.Item label="PDF yoki rasm yuklash (ixtiyoriy)">
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Faylni yuklash uchun bosing yoki sudrab keling
            </p>
            <p className="ant-upload-hint">
              Faqat PDF yoki rasm format. Maksimal hajm: 10MB
            </p>
          </Upload.Dragger>
        </Form.Item>

        {/* Fayl URL */}
        <Form.Item
          name="fileUrl"
          label="Yoki fayl havolasi"
          extra="Yuqorida fayl yuklagan bo'lsangiz, bu maydonni to‘ldirmasangiz ham bo‘ladi"
        >
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
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            loading={loading || internalLoading} // ✅ ikkala loadingni birlashtirdik
          >
            {editing ? "Yangilash" : "Qo'shish"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ControlsModal;
