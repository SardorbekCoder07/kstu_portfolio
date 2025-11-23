import { useState } from "react";
import { PlusOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select, Upload, Typography, Empty } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Control = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const controls = [
    {
      id: 1,
      title: "Aziziddin Nasafiy “Insoni komil” asarining falsafiy tahlili",
      researcher: "Hasanova Shoxida Sadriddinovna",
      university: "Andijon davlat universiteti",
      year: 2025,
      level: "Usta",
      type: "Milliy",
      role: "Nazoratchi",
      status: "Tugallandi",
      fileUrl: "#",
    },
  ];

  return (
    <div className="bg-white mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <Title level={2} className="!m-0 font-semibold">
          Nazorat Ishlari
        </Title>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="bg-blue-600 shadow-md hover:bg-blue-700"
          onClick={openModal}
        >
          Nazorat qo‘shish
        </Button>
      </div>

      {/* Empty */}
      {controls.length === 0 ? (
        <Empty description="Hozircha nazoratlar mavjud emas" className="py-24">
          <Button type="primary" size="large" onClick={openModal}>
            Birinchi nazoratni qo‘shish
          </Button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {controls.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              {/* Chap qism */}
              <div className="flex items-start gap-4">
                {/* Gradient raqam */}
                <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow">
                  {index + 1}
                </div>

                {/* Matnlar */}
                <div className="flex flex-col gap-2">
                  <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                    {item.title}
                  </p>

                  <p className="text-gray-600 text-xs !m-0">
                    Tadqiqotchi: <span className="font-medium">{item.researcher}</span>
                  </p>

                  <p className="text-gray-600 text-xs italic !m-0">
                    Universitet: <span className="font-medium">{item.university}</span>
                  </p>

                  {/* Taglar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      {item.year}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {item.level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {item.type}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {item.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        item.status === "Tugallandi"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* PDF */}
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none"
                >
                  <DownloadOutlined className="text-lg" />
                  <span className="text-[13px] font-medium">PDF Fayli</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal
        title={<Title level={3}>Yangi nazorat qo‘shish</Title>}
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
              label="Nazorat nomi"
              rules={[{ required: true, message: "Nomini kiriting" }]}
            >
              <Input size="large" placeholder="Nazorat nomi..." />
            </Form.Item>

            <Form.Item
              name="researcher"
              label="Tadqiqotchi"
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder="Tadqiqotchi ismi..." />
            </Form.Item>

            <Form.Item name="university" label="Universitet">
              <Input size="large" placeholder="Universitet nomi..." />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="year" label="Yil" rules={[{ required: true }]}>
                <Input type="number" size="large" />
              </Form.Item>

              <Form.Item name="level" label="Daraja">
                <Select size="large">
                  <Select.Option value="Usta">Usta</Select.Option>
                  <Select.Option value="O‘rta">O‘rta</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="type" label="Turi">
                <Input size="large" />
              </Form.Item>

              <Form.Item name="role" label="Roli">
                <Input size="large" />
              </Form.Item>
            </div>

            <Form.Item name="status" label="Holati">
              <Select size="large">
                <Select.Option value="Tugallandi">Tugallandi</Select.Option>
                <Select.Option value="Jarayonda">Jarayonda</Select.Option>
              </Select>
            </Form.Item>

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

export default Control;
