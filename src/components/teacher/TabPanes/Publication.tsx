import {
  Spin,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Empty,
  Typography,
  Pagination,
  Popconfirm,
} from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePublicationOperations } from "../../../hooks/usePublicationOperation";
import Dragger from "antd/es/upload/Dragger";
import { toast } from "sonner";

const { Title } = Typography;
const { TextArea } = Input;

interface Publication {
  id: number;
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: string;
  author: string;
  degree: string;
  volume: string;
  institution: string;
  popular: boolean;
}

const PublicationList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>(
    {}
  );

  const {
    publications,
    total,
    isPublicationLoading,
    createPublicationMutation,
    updatePublicationMutation,
    deletePublicationMutation,
    uploadPDFMutation,
    refetch,
  } = usePublicationOperations(parseInt(id!), currentPage, pageSize, () => {
    handleClose();
    refetch();
  });

  const handleClose = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
    setEditingItem(null);
  };

  const toggleExpand = (itemId: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleEditOpen = (item: Publication) => {
    setEditingItem(item);

    form.setFieldsValue({
      name: item.name,
      description: item.description,
      year: item.year,
      type: item.type,
      author: item.author,
      degree: item.degree,
      volume: item.volume,
      institution: item.institution,
      popular: item.popular,
      fileUrl: item.fileUrl,
    });

    openModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePublicationMutation.mutateAsync(id);
    } catch {}
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let finalPdfUrl = values.fileUrl || "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        finalPdfUrl = await uploadPDFMutation.mutateAsync(
          fileList[0].originFileObj as File
        );
      }

      const data = {
        ...values,
        fileUrl: finalPdfUrl,
        userId: parseInt(id!),
      };

      if (editingItem) {
        await updatePublicationMutation.mutateAsync({ id: editingItem.id, ...data });
      } else {
        await createPublicationMutation.mutateAsync(data);
      }

      handleClose();
    } catch (err: any) {
      if (err.errorFields) {
        toast.error("Iltimos, barcha majburiy maydonlarni to‘ldiring!");
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
      const ok = file.size / 1024 / 1024 < 10;
      if (!ok) {
        toast.error("PDF hajmi 10MB dan kichik bo‘lishi kerak!");
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
              Nashrlar (Publications)
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-blue-600 shadow-md hover:bg-blue-700"
              onClick={openModal}
            >
              Nashr qo‘shish
            </Button>
          </div>

          {isPublicationLoading ? (
            <div className="flex justify-center py-32">
              <Spin />
            </div>
          ) : publications.length === 0 ? (
            <Empty description="Hozircha nashrlar mavjud emas" className="py-24">
              <Button type="primary" onClick={openModal}>
                Birinchi nashrni qo‘shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {publications.map((item, index) => {
                const isExpanded = expandedCards[item.id];
                const tooLong = (item.description?.length || 0) > 150;
                const desc =
                  isExpanded || !tooLong
                    ? item.description
                    : item.description.substring(0, 150) + "...";

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all relative group"
                  >
                    {/* Edit / Delete */}
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        className="bg-blue-500 border-0"
                        onClick={() => handleEditOpen(item)}
                      >
                        Tahrirlash
                      </Button>
                      <Popconfirm
                        title="Nashrni o‘chirish"
                        description="Haqiqatan ham o‘chirmoqchimisiz?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Ha, o‘chirish"
                        cancelText="Yo‘q"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          loading={deletePublicationMutation.isPending}
                        >
                          O‘chirish
                        </Button>
                      </Popconfirm>
                    </div>

                    <div className="flex items-start gap-4 flex-1 pr-4">
                      <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow">
                        {currentPage * pageSize + index + 1}
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-gray-900 font-semibold text-sm !m-0">
                          {item.name}
                        </p>

                        <div>
                          <p className="text-gray-600 text-xs !m-0">{desc}</p>
                          {tooLong && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1"
                            >
                              {isExpanded ? "Kamroq ko‘rish" : "Ko‘proq ko‘rish"}
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                            {item.year}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {item.type}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {item.author}
                          </span>
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                            {item.degree}
                          </span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                            {item.institution}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${
                              item.popular
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.popular ? "Popular" : "Oddiy"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow flex-shrink-0"
                      >
                        <DownloadOutlined className="text-lg" />
                        <span className="text-[13px] font-medium">PDF Fayli</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {total > 0 && (
            <div className="flex justify-end mt-8">
              <Pagination
                current={currentPage + 1}
                total={total}
                pageSize={pageSize}
                onChange={(p) => setCurrentPage(p - 1)}
                onShowSizeChange={(_, size) => {
                  setPageSize(size);
                  setCurrentPage(0);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} / ${total} ta`
                }
                pageSizeOptions={["10", "20", "30", "50"]}
              />
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        title={
          <Title level={3}>
            {editingItem ? "Nashrni tahrirlash" : "Yangi nashr qo‘shish"}
          </Title>
        }
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: "ARTICLE",
            author: "COAUTHOR",
            degree: "INTERNATIONAL",
            popular: false,
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="name"
              label="Nashr nomi"
              rules={[{ required: true, message: "Nomini kiriting!" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item name="description" label="Qisqa tavsif">
              <TextArea rows={3} />
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
                name="institution"
                label="Tashkilot"
                rules={[{ required: true, message: "Tashkilotni kiriting!" }]}
              >
                <Input size="large" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="type"
                label="Nashr turi"
                rules={[{ required: true, message: "Turini tanlang!" }]}
              >
                <Select size="large">
                  <Select.Option value="ARTICLE">Maqola</Select.Option>
                  <Select.Option value="BOOK">Kitob</Select.Option>
                  <Select.Option value="THESIS">Tadqiqot</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="author"
                label="Mualliflik"
                rules={[{ required: true, message: "Tanlang!" }]}
              >
                <Select size="large">
                  <Select.Option value="AUTHOR">Muallif</Select.Option>
                  <Select.Option value="COAUTHOR">Hammuallif</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="degree"
                label="Daraja"
                rules={[{ required: true, message: "Darajani tanlang!" }]}
              >
                <Select size="large">
                  <Select.Option value="LOCAL">Mahalliy</Select.Option>
                  <Select.Option value="INTERNATIONAL">Xalqaro</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="volume" label="Volume (ixtiyoriy)">
                <Input size="large" />
              </Form.Item>
            </div>

            <Form.Item
              name="popular"
              label="Popularlik"
              rules={[{ required: true, message: "Tanlang!" }]}
            >
              <Select size="large">
                <Select.Option value={true}>Popular</Select.Option>
                <Select.Option value={false}>Oddiy</Select.Option>
              </Select>
            </Form.Item>

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
                  Faqat PDF. Maks 10MB.
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="fileUrl"
              label="Yoki PDF havolasi"
              extra="Agar fayl yuklasangiz, bu maydon shart emas"
            >
              <Input
                size="large"
                placeholder="https://example.com/file.pdf"
                disabled={fileList.length > 0}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleClose}>Bekor qilish</Button>
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              loading={
                createPublicationMutation.isPending ||
                updatePublicationMutation.isPending ||
                uploadPDFMutation.isPending
              }
            >
              {editingItem ? "Saqlash" : "Qo‘shish"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default PublicationList;
