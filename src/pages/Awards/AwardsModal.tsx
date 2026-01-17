import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select, Upload, Typography, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export interface AwardFormData {
  name: string;
  description?: string;
  year?: number;
  awardEnum?: string;
  memberEnum?: string;
  fileUrl?: string;
  popular?: boolean;
  userId?: number;
}

export const INITIAL_AWARD_FORM: AwardFormData = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  awardEnum: "Trening_Va_Amaliyot",
  memberEnum: "MILLIY",
  fileUrl: "",
  popular: false,
  userId: undefined,
};

interface AwardModalProps {
  open: boolean;
  onCancel: () => void;
  formData: AwardFormData;
  onChange: <K extends keyof AwardFormData>(key: K, value: AwardFormData[K]) => void;
  fileList: UploadFile[];
  onFileChange: (files: UploadFile[]) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  editing?: boolean;
}

export const AwardModal: React.FC<AwardModalProps> = ({
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

  useEffect(() => {
    if (open) {
      form.setFieldsValue(formData);

      // Edit rejimida eski PDFni fileListga qo‘shish
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
      title={<Title level={4}>{editing ? "Mukofotni tahrirlash" : "Yangi mukofot qo'shish"}</Title>}
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
          label="Mukofot nomi"
          rules={[{ required: true, message: "Nomini kiriting!" }]}
        >
          <Input
            size="large"
            placeholder="Mukofot nomi..."
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Form.Item>

        <Form.Item name="description" label="Qisqa tavsif">
          <TextArea
            rows={3}
            placeholder="Mukofot haqida qisqacha..."
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Form.Item>

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
            name="awardEnum"
            label="Mukofot turi"
            rules={[{ required: true, message: "Turini tanlang!" }]}
          >
            <Select
              size="large"
              value={formData.awardEnum}
              onChange={(val) => onChange("awardEnum", val)}
            >
              <Select.Option value="Trening_Va_Amaliyot">Trening va Amaliyot</Select.Option>
              <Select.Option value="Tahririyat_Kengashiga_Azolik">Tahririyat kengashiga azolik</Select.Option>
              <Select.Option value="Maxsus_Kengash_Azoligi">Maxsus kengash azoligi</Select.Option>
              <Select.Option value="Patent_Dgu">Patent DGU</Select.Option>
              <Select.Option value="Davlat_Mukofoti">Davlat mukofoti</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="PDF yuklash (ixtiyoriy)" extra="Yoki quyida havolani kiriting">
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

        <Form.Item>
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onCancel}>Bekor qilish</Button>
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              loading={loading}
            >
              {editing ? "Yangilash" : "Qo'shish"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
