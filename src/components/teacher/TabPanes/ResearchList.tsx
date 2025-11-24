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
import {
  DownloadOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResearchOperations } from "../../../hooks/useResearchOperation";
import Dragger from "antd/es/upload/Dragger";

const { Title } = Typography;
const { TextArea } = Input;

const ResearchList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    researches,
    isResearchLoading,
    createResearchMutation,
    uploadPDFMutation,
    refetch,
  } = useResearchOperations(parseInt(id!), 0, 100, () => {
    handleCloseModal();
    refetch();
  });

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let finalPdfUrl = values.fileUrl || "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          finalPdfUrl = await uploadPDFMutation.mutateAsync(
            fileList[0].originFileObj as File
          );
          message.success({
            content: "PDF muvaffaqiyatli yuklandi!",
            key: "uploadPdf",
          });
        } catch {
          message.error({
            content: "PDF yuklashda xatolik!",
            key: "uploadPdf",
          });
          return;
        }
      }

      await createResearchMutation.mutateAsync({
        name: values.name,
        description: values.description || "",
        year: parseInt(values.year),
        fileUrl: finalPdfUrl,
        userId: parseInt(id!),
        member: values.member ?? true,
        univerName: values.univerName,
        finished: values.finished ?? false,
        memberEnum: values.memberEnum || "MILLIY",
      });

      message.success({
        content: "Tadqiqot muvaffaqiyatli qo'shildi!",
        key: "createResearch",
      });
      handleCloseModal();
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      } else {
        message.error("Xatolik yuz berdi!");
      }
    }
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
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("PDF hajmi 10MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

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

          {isResearchLoading ? (
            <div className="flex justify-center py-32">
              <Spin size="large" />
            </div>
          ) : researches.length === 0 ? (
            <Empty
              description="Hozircha tadqiqotlar mavjud emas"
              className="py-24"
            >
              <Button type="primary" onClick={openModal} size="large">
                Birinchi tadqiqotni qo'shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {researches.map((item, index) => (
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
                        {item.name
                          ? item.description.length > 60
                            ? `${item.description.slice(0, 60)}...`
                            : item.description
                          : "Tavsif kiritilmagan"}
                      </p>
                      <p className="text-gray-600 text-xs !m-0">
                        {item.description
                          ? item.description.length > 70
                            ? `${item.description.slice(0, 70)}...`
                            : item.description
                          : "Tavsif kiritilmagan"}
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
        </div>
      </div>

      <Modal
        title={<Title level={3}>Yangi tadqiqot qo'shish</Title>}
        open={isOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={720}
        className="rounded-xl"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            memberEnum: "MILLIY",
            finished: false,
            member: true,
          }}
        >
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
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  PDFni yuklash uchun bosing yoki sudrab keling
                </p>
                <p className="ant-upload-hint">
                  Faqat PDF formatdagi fayllar. Maksimal hajm: 10MB
                </p>
              </Dragger>
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
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCloseModal}>Bekor qilish</Button>
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              loading={
                createResearchMutation.isPending || uploadPDFMutation.isPending
              }
            >
              Qo'shish
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ResearchList;
