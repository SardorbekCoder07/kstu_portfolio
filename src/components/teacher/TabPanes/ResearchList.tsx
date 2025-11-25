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
  DeleteOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResearchOperations } from "../../../hooks/useResearchOperation";
import Dragger from "antd/es/upload/Dragger";
import { toast } from "sonner";

const { Title } = Typography;
const { TextArea } = Input;

interface Research {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  univerName: string;
  memberEnum: string;
  finished: boolean;
  member: boolean;
}

const ResearchList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});

  const {
    researches,
    total,
    isResearchLoading,
    createResearchMutation,
    updateResearchMutation,
    deleteResearchMutation,
    uploadPDFMutation,
    refetch,
  } = useResearchOperations(
    parseInt(id!),
    currentPage,
    pageSize,
    () => {
      handleCloseModal();
      refetch();
    }
  );

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
    setEditingResearch(null);
  };

  const toggleExpand = (itemId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleOpenEditModal = (research: Research) => {
    setEditingResearch(research);
    form.setFieldsValue({
      name: research.name,
      description: research.description,
      year: research.year,
      univerName: research.univerName,
      memberEnum: research.memberEnum,
      finished: research.finished,
      member: research.member,
      fileUrl: research.fileUrl,
    });
    openModal();
  };

  const handleDelete = async (researchId: number) => {
    try {
      await deleteResearchMutation.mutateAsync(researchId);
    } catch (error) {
    }
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
          toast.success("PDF muvaffaqiyatli yuklandi!");
        } catch {
          toast.error("PDF yuklashda xatolik!");
          return;
        }
      }

      const data = {
        name: values.name,
        description: values.description || "",
        year: parseInt(values.year),
        fileUrl: finalPdfUrl,
        userId: parseInt(id!),
        member: values.member ?? true,
        univerName: values.univerName,
        finished: values.finished ?? false,
        memberEnum: values.memberEnum || "MILLIY",
      };

      if (editingResearch) {
        await updateResearchMutation.mutateAsync({
          id: editingResearch.id,
          ...data,
        });
      } else {
        await createResearchMutation.mutateAsync(data);
      }

      handleCloseModal();
    } catch (error: any) {
      if (error.errorFields) {
        toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
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
        toast.error("PDF hajmi 10MB dan kichik bo'lishi kerak!");
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
              icon={<PlusOutlined />}
              className="bg-blue-600 shadow-md hover:bg-blue-700"
              onClick={openModal}
            >
              Tadqiqot qo'shish
            </Button>
          </div>

          {isResearchLoading ? (
            <div className="flex justify-center py-32">
              <Spin />
            </div>
          ) : researches.length === 0 ? (
            <Empty
              description="Hozircha tadqiqotlar mavjud emas"
              className="py-24"
            >
              <Button type="primary" onClick={openModal}>
                Birinchi tadqiqotni qo'shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {researches.map((item, index) => {
                const isExpanded = expandedCards[item.id];
                const descriptionLength = item.description?.length || 0;
                const shouldShowToggle = descriptionLength > 150;
                const displayDescription = isExpanded || !shouldShowToggle
                  ? item.description
                  : item.description?.substring(0, 150) + "...";

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all relative group"
                  >
                    {/* Edit and Delete Buttons */}
                    <div className="absolute bottom-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md"
                        onClick={() => handleOpenEditModal(item)}
                      >
                        Tahrirlash
                      </Button>
                      <Popconfirm
                        title="Tadqiqotni o'chirish"
                        description="Haqiqatan ham bu tadqiqotni o'chirmoqchimisiz?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Ha, o'chirish"
                        cancelText="Yo'q"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          className="shadow-md"
                          loading={deleteResearchMutation.isPending}
                        >
                          O'chirish
                        </Button>
                      </Popconfirm>
                    </div>

                    <div className="flex items-start gap-4 flex-1 pr-4">
                      <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
                        {currentPage * pageSize + index + 1}
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                          {item.name}
                        </p>
                        <div>
                          <p className="text-gray-600 text-xs !m-0">
                            {displayDescription || "Tavsif kiritilmagan"}
                          </p>
                          {shouldShowToggle && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                            >
                              {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                            </button>
                          )}
                        </div>

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
                            className={`px-3 py-1 rounded-full font-medium ${item.finished
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
                        className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
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
                onChange={(page) => setCurrentPage(page - 1)}
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
                locale={{
                  items_per_page: "/ sahifa",
                  jump_to: "O'tish",
                  page: "Sahifa",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        title={
          <Title level={3}>
            {editingResearch ? "Tadqiqotni tahrirlash" : "Yangi tadqiqot qo'shish"}
          </Title>
        }
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
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              loading={
                createResearchMutation.isPending ||
                updateResearchMutation.isPending ||
                uploadPDFMutation.isPending
              }
            >
              {editingResearch ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ResearchList;