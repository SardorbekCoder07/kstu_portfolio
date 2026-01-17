import React from "react";
import { Modal, Button, Input, Upload, Typography, Select, Form } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export interface ConsultationFormData {
  id?: number;
  userId?: number;
  title: string;
  description?: string;
  year: number;
  fileUrl?: string;
  imgUrl?: string;
  type?: "ARTICLE" | "REPORT" | string;
  author?: "COAUTHOR" | "PRIMARY" | string;
  degree?: "INTERNATIONAL" | "NATIONAL" | string;
  volume?: string;
  institution?: string;
  popular?: boolean;
}

export const INITIAL_CONSULTATION_FORM: ConsultationFormData = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  fileUrl: "",
  imgUrl: "",
  type: "ARTICLE",
  author: "COAUTHOR",
  degree: "INTERNATIONAL",
  volume: "",
  institution: "",
  popular: false,
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

  // Har safar modal ochilganda formani yangilash
  React.useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form, open]);

  const internalDraggerProps: UploadProps = {
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

  const pdfRegex = /^(https?:\/\/[^\s]+\.pdf)$/i;

  const handleFinish = (values: ConsultationFormData) => {
    // Agar fileUrl kiritilgan bo'lsa tekshirish
    if (values.fileUrl && !pdfRegex.test(values.fileUrl)) {
      form.setFields([
        {
          name: "fileUrl",
          errors: ["Iltimos, to‘g‘ri PDF havolasini kiriting!"],
        },
      ]);
      return;
    }
    onSubmit();
  };

  return (
    <Modal
      title={<Title level={4}>{editing ? "Maslahatni tahrirlash" : "Yangi maslahat qo‘shish"}</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
      centered
      className="rounded-xl"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onFinish={handleFinish}
        onValuesChange={(_, allValues) => {
          // Formdagi o'zgarishlarni parent komponentga uzatish
          (Object.keys(allValues) as Array<keyof ConsultationFormData>).forEach((key) => {
            if (allValues[key] !== undefined) {
              onChange(key, allValues[key]);
            }
          });
        }}
      >
        <Form.Item
          name="title"
          label="Maslahat nomi"
          rules={[{ required: true, message: "Bu maydonni to‘ldirish shart!" }]}
        >
          <Input size="large" placeholder="Maslahat nomi..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Tavsif"
          rules={[{ required: true, message: "Tavsifni kiriting" }]}
        >
          <TextArea rows={3} placeholder="Maslahat tavsifini kiriting..." />
        </Form.Item>

        <Form.Item
          name="year"
          label="Yil"
          rules={[{ required: true, message: "Yilni kiriting" }]}
        >
          <Input type="number" size="large" placeholder="Yil" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Turi"
          rules={[{ required: true, message: "Turini tanlang" }]}
        >
          <Select size="large" placeholder="Turini tanlang">
            <Select.Option value="ARTICLE">Maqola</Select.Option>
            <Select.Option value="REPORT">Hisobot</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="author"
          label="Mualliflik darajasi"
          rules={[{ required: true, message: "Muallifni tanlang" }]}
        >
          <Select size="large" placeholder="Muallifni tanlang">
            <Select.Option value="COAUTHOR">Hammuallif</Select.Option>
            <Select.Option value="PRIMARY">Asosiy muallif</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="degree"
          label="Daraja"
          rules={[{ required: true, message: "Darajani tanlang" }]}
        >
          <Select size="large" placeholder="Darajani tanlang">
            <Select.Option value="INTERNATIONAL">Xalqaro</Select.Option>
            <Select.Option value="NATIONAL">Milliy</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="volume"
          label="Jild / Volume"
          rules={[{ required: true, message: "Jild raqamini kiriting" }]}
        >
          <Input size="large" placeholder="Jild / Volume" />
        </Form.Item>

        <Form.Item
          name="institution"
          label="Universitet / Tashkilot"
          rules={[{ required: true, message: "Tashkilot nomini kiriting" }]}
        >
          <Input size="large" placeholder="Universitet / Tashkilot" />
        </Form.Item>

        <Form.Item
          name="popular"
          label="Omma uchun mashhurmi?"
          rules={[{ required: true, message: "Tanlovni belgilang" }]}
        >
          <Select size="large" placeholder="Omma uchun mashhur">
            <Select.Option value={true}>Ha</Select.Option>
            <Select.Option value={false}>Yo‘q</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="PDF fayl">
          <Upload.Dragger {...internalDraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Faylni yuklash uchun bosing yoki sudrab keling
            </p>
            <p className="ant-upload-hint text-gray-500">
              Faqat PDF format. Maksimal hajm: 10MB
            </p>
          </Upload.Dragger>

          {formData.imgUrl && !fileList.length && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Hozirgi rasm</p>
              <img
                src={formData.imgUrl}
                alt="Current"
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          )}

          <Form.Item
            name="fileUrl"
            noStyle
          >
            <Input
              className="mt-3"
              placeholder="Yoki fayl havolasini kiriting (PDF)"
              size="large"
              disabled={fileList.length > 0}
            />
          </Form.Item>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {editing ? "Yangilash" : "Saqlash"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ConsultationsModal;