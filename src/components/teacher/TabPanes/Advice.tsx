import { useState } from "react";
import { PlusOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select, Upload, Typography } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Advice = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const publications = [
    {
      id: 1,
      title: "Uilyam Djems ijodida haqiqiy muammo yechimi",
      journal: '"ISTF" ilmiy-uslubiy jurnal maxsus soni',
      year: 2025,
      authorType: "Faqat birinchi muallif",
      fileUrl: "#",
    },
  ];

  return (
    <div className="space-y-4 bg-white mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <Title level={2} className="!mb-0 font-semibold">
          Maslahatlar
        </Title>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="bg-blue-600 shadow-md hover:bg-blue-700"
          onClick={openModal}
        >
          Yangi tadqiqot
        </Button>
      </div>

      {/* Kartochkalar */}
      {publications.map((item, index) => (
        <div
          key={item.id}
          className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all"
        >
          {/* Chap qism */}
          <div className="flex items-start gap-4">
            {/* Raqam */}
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow">
              {index + 1}
            </div>

            {/* Matnlar */}
            <div className="flex flex-col gap-2">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.title}
              </p>

              <p className="text-gray-600 text-xs italic !m-0">{item.journal}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {item.authorType}
                </span>
              </div>
            </div>
          </div>

          {/* PDF */}
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none"
          >
            <DownloadOutlined className="text-lg" />
            <span className="text-[13px] font-medium">PDF Fayli</span>
          </a>
        </div>
      ))}

      {/* MODAL */}
      <Modal
        title={<Title level={3}>Yangi tadqiqot qo‘shish</Title>}
        open={isOpen}
        onCancel={closeModal}
        footer={null}
        width={720}
        className="rounded-xl"
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="title"
              label="Tadqiqot nomi"
              rules={[{ required: true, message: "Nomi kerak" }]}
            >
              <Input size="large" placeholder="Tadqiqot nomi..." />
            </Form.Item>

            <Form.Item name="description" label="Qisqa tavsif">
              <TextArea rows={3} placeholder="Tavsif..." />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="year"
                label="Yil"
                rules={[{ required: true }]}
              >
                <Input type="number" size="large" />
              </Form.Item>

              <Form.Item
                name="authorType"
                label="Mualliflik turi"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="birinchi">Faqat birinchi muallif</Select.Option>
                  <Select.Option value="hammuallif">Hammuallif</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item label="PDF yuklash">
              <Upload>
                <Button icon={<UploadOutlined />}>PDF tanlash</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="fileUrl" label="PDF havolasi">
              <Input size="large" placeholder="https://example.com/file.pdf" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={closeModal}>Bekor qilish</Button>
            <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700">
              Qo‘shish
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Advice;
