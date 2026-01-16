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

export interface ControlsFormData {
  name: string;
  description?: string;
  year: number;
  univerName?: string;
  level?: string;
  memberEnum?: "MILLIY" | "XALQARO" | null;
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
  onSubmit: () => void;
  loading: boolean;
  editing?: boolean;
  draggerProps?: UploadProps;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
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
    accept: ".pdf,image/*",
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
        <Title level={3}>
          {editing ? "Nazoratni tahrirlash" : "Yangi nazorat qo'shish"}
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
          label="Nazorat nomi"
          rules={[{ required: true, message: "Nomini kiriting!" }]}
        >
          <Input placeholder="Nazorat nomi..." size="large" />
        </Form.Item>

        <Form.Item name="description" label="Tavsif (ixtiyoriy)">
          <TextArea rows={3} placeholder="Tavsif kiriting..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="year"
            label="Yil"
            rules={[{ required: true, message: "Yilni kiriting!" }]}
          >
            <Input type="number" placeholder="2024" size="large" />
          </Form.Item>

          <Form.Item name="univerName" label="Universitet / Tashkilot">
            <Input placeholder="TATU, INHA..." size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="level" label="Daraja">
            <Input placeholder="Boshlang‘ich, Magistr..." size="large" />
          </Form.Item>

          <Form.Item name="memberEnum" label="A’zolik turi">
            <Select
              placeholder="Milliy yoki Xalqaro"
              value={formData.memberEnum}
              onChange={(v) => onChange("memberEnum", v)}
              allowClear
              size="large"
            >
              <Select.Option value="MILLIY">Milliy</Select.Option>
              <Select.Option value="XALQARO">Xalqaro</Select.Option>
            </Select>
          </Form.Item>
        </div>

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

        <Form.Item label="PDF yoki rasm yuklash (ixtiyoriy)">
          <Upload.Dragger {...internalDraggerProps}>
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

        <Form.Item
          name="fileUrl"
          label="Yoki fayl havolasini kiriting"
          extra="Yuqorida fayl yuklagan bo'lsangiz, bu maydonni to'ldirmasangiz ham bo'ladi"
        >
          <Input
            placeholder="https://example.com/file.pdf"
            size="large"
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

export default ControlsModal;
