import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Typography,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export interface ResearchFormData {
  name: string;
  description: string;
  year: number;
  univerName: string;
  memberEnum: "MILLIY" | "XALQARO";
  finished: boolean;
  member: boolean;
  fileUrl?: string;
  userId?: number;
}

export const INITIAL_FORM: ResearchFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  univerName: "",
  memberEnum: "MILLIY",
  finished: false,
  member: true,
  fileUrl: "",
  userId: undefined,
};

interface ResearchModalProps {
  open: boolean;
  onCancel: () => void;
  formData: ResearchFormData;
  onChange: <K extends keyof ResearchFormData>(
    key: K,
    value: ResearchFormData[K]
  ) => void;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  editing?: boolean;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({
  open,
  onCancel,
  formData,
  onChange,
  fileList,
  onFileChange,
  onSubmit,
  loading,
  editing = false,
}) => {
  const [form] = Form.useForm();

  const pdfUrlRegex = /^(https?:\/\/[^\s]+\.pdf)$/i;

  // Edit rejimida eski malumotlarni formga qo‘yish
  useEffect(() => {
    if (open) {
      form.setFieldsValue(formData);
      // Agar API'dan PDF kelgan bo'lsa, fileList ga qo‘shish
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

      await onSubmit();
    } catch (error) {
      console.log("Form validation error", error);
    }
  };

  const uploadProps: UploadProps = {
    accept: ".pdf",
    maxCount: 1,
    fileList,
    onRemove: () => {
      onFileChange([]);
      return true;
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("PDF hajmi 10MB dan kichik bo'lishi kerak!");
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
  };

  return (
    <Modal
      title={
        <Title level={4}>
          {editing ? "Tadqiqotni tahrirlash" : "Yangi tadqiqot qo'shish"}
        </Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      className="rounded-xl"
      bodyStyle={{ paddingTop: 24, paddingBottom: 24 }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tadqiqot nomi"
          rules={[{ required: true, message: "Nomini kiriting!" }]}
        >
          <Input
            size="large"
            placeholder="Tadqiqot nomi..."
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Form.Item>

        <Form.Item name="description" label="Qisqa tavsif">
          <TextArea
            rows={3}
            placeholder="Tadqiqot haqida qisqacha..."
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="year"
            label="Yil"
            rules={[{ required: true, message: "Yilni kiriting!" }]}
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
            rules={[{ required: true, message: "Universitetni kiriting!" }]}
          >
            <Input
              size="large"
              placeholder="TATU, INHA..."
              onChange={(e) => onChange("univerName", e.target.value)}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="memberEnum"
            label="A'zolik turi"
            rules={[{ required: true, message: "Turini tanlang!" }]}
          >
            <Select
              size="large"
              value={formData.memberEnum}
              onChange={(val) => onChange("memberEnum", val)}
            >
              <Select.Option value="MILLIY">Milliy</Select.Option>
              <Select.Option value="XALQARO">Xalqaro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="finished"
            label="Holati"
            rules={[{ required: true, message: "Holatini tanlang!" }]}
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
        </div>

        <Form.Item
          label="PDF yuklash (ixtiyoriy)"
          extra="Yoki quyida havolani kiriting"
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              PDFni yuklash uchun bosing yoki sudrab keling
            </p>
            <p className="ant-upload-hint">
              Faqat PDF formatdagi fayllar. Maksimal hajm: 10MB
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item
          name="fileUrl"
          label="Yoki PDF havolasini kiriting"
          extra="Yuqorida fayl yuklagan bo'lsangiz, bu maydonni to'ldirmasangiz ham bo'ladi"
        >
          <Input
            size="large"
            placeholder="https://example.com/file.pdf"
            disabled={fileList.length > 0}
            onChange={(e) => onChange("fileUrl", e.target.value)}
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            {editing ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
