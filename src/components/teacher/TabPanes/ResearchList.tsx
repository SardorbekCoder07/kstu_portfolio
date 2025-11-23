import {
  Spin,
  Modal,
  Button,
  message,
  Form,
  Input,
  Select,
  Upload,
  Empty,
  Typography,
} from "antd";
import { UploadOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";

const { Title } = Typography;
const { TextArea } = Input;

const ResearchAdvice: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 🔵 Statik ma'lumot (API O'RNIGA)
  const research = [
    {
      id: 1,
      name: "Sun'iy intellekt asosida tahlil",
      description: "AI yordamida ma’lumotlarni qayta ishlash",
      year: 2024,
      fileUrl: "#",
      member: true,
      memberEnum: "MILLIY",
      univerName: "TATU",
      finished: true,
    },
  ];

  const isLoading = false;

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success("Tadqiqot qo‘shildi (faqat dizaynda)!");
      handleCloseModal();
    } catch (_) {}
  };

  const uploadProps: UploadProps = {
    accept: ".pdf",
    maxCount: 1,
    fileList,
    onRemove: () => {
      setFileList([]);
      return true;
    },
    beforeUpload: (file) => {
      setFileList([
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
    <>
      <div className="bg-white">
        <div className="mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Title level={2} className="!mb-0 font-semibold">
              Ilmiy Tadqiqotlar
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="bg-blue-600 shadow-md hover:bg-blue-700"
              onClick={openModal}
            >
              Tadqiqot qo'shish
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-32">
              <Spin size="large" />
            </div>
          ) : research.length === 0 ? (
            <Empty description="Hozircha tadqiqotlar mavjud emas" className="py-24">
              <Button type="primary" onClick={openModal} size="large">
                Birinchi tadqiqotni qo‘shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {research.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
                      {index + 1}
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                        {item.name}
                      </p>
                      <p className="text-gray-600 text-xs !m-0">
                        {item.description || "Tavsif kiritilmagan"}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                          {item.year}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {item.member ? "A'zo" : "A'zo emas"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {item.memberEnum}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                          {item.univerName}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            item.finished
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.finished ? "Tugallangan" : "Jarayonda"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
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
        </div>
      </div>

      <Modal
        title={<Title level={3}>Yangi tadqiqot qo‘shish</Title>}
        open={isOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={720}
        className="rounded-xl"
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="name"
              label="Tadqiqot nomi"
              rules={[{ required: true, message: "Nomini kiriting!" }]}
            >
              <Input size="large" placeholder="Sun'iy intellekt asosida..." />
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
                <Input type="number" size="large" />
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
              <Form.Item name="memberEnum" label="A'zolik turi">
                <Select size="large">
                  <Select.Option value="MILLIY">Milliy</Select.Option>
                  <Select.Option value="XALQARO">Xalqaro</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="finished" label="Holati">
                <Select size="large">
                  <Select.Option value={false}>Jarayonda</Select.Option>
                  <Select.Option value={true}>Tugallangan</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item label="PDF yuklash (ixtiyoriy)">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>PDF tanlash</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="fileUrl" label="PDF havolasi">
              <Input size="large" placeholder="https://example.com/file.pdf" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCloseModal}>Bekor qilish</Button>
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Qo‘shish
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ResearchAdvice;
