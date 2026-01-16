import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Typography,
  Switch,
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
  onSubmit: () => void;
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
        alert("PDF hajmi 10MB dan kichik bo'lishi kerak!");
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
        <Title level={3}>
          {editing ? "Tadqiqotni tahrirlash" : "Yangi tadqiqot qo'shish"}
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
          name="name"
          label="Tadqiqot nomi"
          rules={[{ required: true, message: "Nomini kiriting!" }]}
        >
          <Input size="large" placeholder="Tadqiqot nomi..." />
        </Form.Item>

        <Form.Item name="description" label="Qisqa tavsif">
          <TextArea rows={3} placeholder="Tadqiqot haqida qisqacha..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="year"
            label="Yil"
            rules={[{ required: true, message: "Yilni kiriting!" }]}
          >
            <Input type="number" size="large" placeholder="2024" />
          </Form.Item>

          <Form.Item
            name="univerName"
            label="Universitet / Tashkilot"
            rules={[{ required: true, message: "Universitetni kiriting!" }]}
          >
            <Input size="large" placeholder="TATU, INHA..." />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="memberEnum"
            label="A'zolik turi"
            rules={[{ required: true, message: "Turini tanlang!" }]}
          >
            <Select size="large">
              <Select.Option value="MILLIY">Milliy</Select.Option>
              <Select.Option value="XALQARO">Xalqaro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="finished"
            label="Holati"
            rules={[{ required: true, message: "Holatini tanlang!" }]}
          >
            <Select size="large">
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
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onSubmit}
            loading={loading}
          >
            {editing ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
