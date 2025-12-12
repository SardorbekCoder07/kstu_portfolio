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
import { useAdviceOperations } from "../../../hooks/useAdviceOperation";
import Dragger from "antd/es/upload/Dragger";
import { toast } from "sonner";

const { Title } = Typography;
const { TextArea } = Input;

export enum FinishedEnum {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

interface AdviceItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

const AdviceList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingAdvice, setEditingAdvice] = useState<AdviceItem | null>(null);
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const {
    advices,
    total,
    isAdviceLoading,
    createAdviceMutation,
    updateAdviceMutation,
    deleteAdviceMutation,
    uploadPDFMutation,
    refetch,
  } = useAdviceOperations(parseInt(id!), currentPage, pageSize, () => {
    handleCloseModal();
    refetch();
  });

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
    setEditingAdvice(null);
  };

  const toggleExpand = (itemId: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleOpenEditModal = (advice: AdviceItem) => {
    setEditingAdvice(advice);
    form.setFieldsValue({
      name: advice.name,
      description: advice.description,
      year: advice.year,
      leader: advice.leader,
      member: advice.member,
      finishedEnum: advice.finishedEnum,
      fileUrl: advice.fileUrl,
    });
    setFileList(
      advice.fileUrl
        ? [
            {
              uid: "-1",
              name: "Mavjud PDF",
              status: "done",
              url: advice.fileUrl,
            },
          ]
        : []
    );
    openModal();
  };

  const handleDelete = async (adviceId: number) => {
    try {
      await deleteAdviceMutation.mutateAsync(adviceId);
      toast.success("Maslahat muvaffaqiyatli o‘chirildi");
    } catch {
      toast.error("O‘chirishda xatolik yuz berdi");
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
        } catch {
          toast.error("PDF yuklashda xatolik yuz berdi");
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
        finishedEnum: values.finishedEnum,
        leader: values.leader,
      };

      if (editingAdvice) {
        await updateAdviceMutation.mutateAsync({
          id: editingAdvice.id,
          ...data,
        });
      } else {
        await createAdviceMutation.mutateAsync(data);
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
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <Title level={2} className="!mb-0 font-semibold">
              Maslahatlar
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="bg-blue-600 shadow-md hover:bg-blue-700"
              onClick={openModal}
            >
              Maslahat qo‘shish
            </Button>
          </div>

          {/* Loading yoki Empty */}
          {isAdviceLoading ? (
            <div className="flex justify-center py-32">
              <Spin />
            </div>
          ) : advices.length === 0 ? (
            <Empty
              description="Hozircha maslahatlar mavjud emas"
              className="py-24"
            >
              <Button type="primary" onClick={openModal}>
                Birinchi maslahatni qo‘shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {advices.map((item, index) => {
                const isExpanded = expandedCards[item.id];
                const descLength = item.description?.length || 0;
                const showToggle = descLength > 150;
                const displayDesc =
                  isExpanded || !showToggle
                    ? item.description
                    : item.description?.substring(0, 150) + "...";

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all relative group"
                  >
                    {/* Edit & Delete */}
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
                        title="Maslahatni o‘chirish"
                        description="Haqiqatan ham o‘chirmoqchimisiz?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Ha"
                        cancelText="Yo‘q"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          className="shadow-md"
                          loading={deleteAdviceMutation.isPending}
                        >
                          O‘chirish
                        </Button>
                      </Popconfirm>
                    </div>

                    {/* Chap qism */}
                    <div className="flex items-start gap-4 flex-1 pr-4">
                      <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow">
                        {currentPage * pageSize + index + 1}
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                          {item.name}
                        </p>

                        {item.description && (
                          <div>
                            <p className="text-gray-600 text-xs !m-0">
                              {displayDesc || "Tavsif kiritilmagan"}
                            </p>
                            {showToggle && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1"
                              >
                                {isExpanded ? "Kamroq" : "Ko‘proq"} ko‘rish
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                            {item.year}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {item.member ? "A'zo" : "A'zo emas"}
                          </span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                            {item.leader}
                          </span>

                          {/* Holat — to‘g‘ri enum qiymatlari bilan */}
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-xs ${
                              item.finishedEnum === FinishedEnum.COMPLETED ||
                              item.finishedEnum === FinishedEnum.FINISHED
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.finishedEnum === FinishedEnum.COMPLETED &&
                              "Tugallangan"}
                            {item.finishedEnum === FinishedEnum.FINISHED &&
                              "Yakunlangan"}
                            {item.finishedEnum === FinishedEnum.IN_PROGRESS &&
                              "Jarayonda"}
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
                        className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
                      >
                        <DownloadOutlined className="text-lg" />
                        <span className="text-[13px] font-medium">
                          PDF Fayli
                        </span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
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
                  jump_to: "O‘tish",
                  page: "Sahifa",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        title={
          <Title level={3}>
            {editingAdvice
              ? "Maslahatni tahrirlash"
              : "Yangi maslahat qo‘shish"}
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
            member: true,
            finishedEnum: FinishedEnum.IN_PROGRESS,
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="name"
              label="Maslahat nomi"
              rules={[{ required: true, message: "Nomini kiriting!" }]}
            >
              <Input size="large" placeholder="Maslahat nomi..." />
            </Form.Item>

            <Form.Item name="description" label="Qisqa tavsif">
              <TextArea rows={3} placeholder="Maslahat haqida qisqacha..." />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="year"
                label="Yil"
                rules={[{ required: true, message: "Yilni kiriting!" }]}
              >
                <Input type="number" size="large" placeholder="2025" />
              </Form.Item>

              <Form.Item
                name="leader"
                label="Rahbar (F.I.O)"
                rules={[{ required: true, message: "Rahbarni kiriting!" }]}
              >
                <Input size="large" placeholder="Aliyev A.A." />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="member" label="A'zo">
                <Select size="large">
                  <Select.Option value={true}>Ha</Select.Option>
                  <Select.Option value={false}>Yo‘q</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="finishedEnum"
                label="Holati"
                rules={[{ required: true, message: "Holati tanlang!" }]}
              >
                <Select size="large" placeholder="Tanlang">
                  <Select.Option value={FinishedEnum.IN_PROGRESS}>
                    Jarayonda
                  </Select.Option>
                  <Select.Option value={FinishedEnum.COMPLETED}>
                    Tugallangan
                  </Select.Option>
                  <Select.Option value={FinishedEnum.FINISHED}>
                    Yakunlangan
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              label="PDF yuklash (ixtiyoriy)"
              extra="Yoki havolani quyida kiriting"
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  PDFni bosing yoki sudrab keling
                </p>
                <p className="ant-upload-hint">Faqat PDF, maksimal 10MB</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="fileUrl"
              label="Yoki PDF havolasini kiriting"
              extra="Yuqorida fayl yuklasangiz bu maydonni to‘ldirish shart emas"
            >
              <Input
                size="large"
                placeholder="https://example.com/advice.pdf"
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
                createAdviceMutation.isPending ||
                updateAdviceMutation.isPending ||
                uploadPDFMutation.isPending
              }
            >
              {editingAdvice ? "Saqlash" : "Qo‘shish"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AdviceList;
