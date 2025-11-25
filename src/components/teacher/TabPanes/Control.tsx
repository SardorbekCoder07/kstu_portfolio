import { useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Typography,
  Empty,
  Spin,
  Pagination,
  Popconfirm,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useModal } from "../../../hooks/useModal";
import { useControlOperations } from "../../../hooks/useControlOperation";

const { Title } = Typography;
const { TextArea } = Input;

interface ControlItem {
  id: number;
  name: string;
  description: string | null;
  year: number;
  fileUrl: string | null;
  researcherName: string;
  univerName?: string | null;
  level?: string | null;
  finished: boolean;
}

const Control = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id!);
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editingItem, setEditingItem] = useState<ControlItem | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const {
    controles,
    total,
    isControlLoading,
    createControlMutation,
    updateControlMutation,
    deleteControlMutation,
    uploadPDFMutation,
  } = useControlOperations(userId, currentPage, pageSize, () => {
    closeModal();
    form.resetFields();
    setFileList([]);
    setEditingItem(null);
  });

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (item: ControlItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description || "",
      year: item.year,
      researcherName: item.researcherName,
      univerName: item.univerName || "",
      level: item.level || undefined,
      finished: item.finished,
      fileUrl: item.fileUrl || "",
    });
    setFileList([]);
    openModal();
  };

  const handleDelete = async (id: number) => {
    await deleteControlMutation.mutateAsync(id);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let finalPdfUrl = values.fileUrl?.trim() || "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          finalPdfUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
        } catch {
          toast.error("PDF yuklashda xatolik yuz berdi!");
          return;
        }
      }

      const payload = {
        name: values.name,
        description: values.description?.trim() || "",
        year: Number(values.year),
        researcherName: values.researcherName,
        univerName: values.univerName?.trim() || "",
        level: values.level || null,
        finished: values.finished,
        fileUrl: finalPdfUrl || null,
        userId,
      };

      if (editingItem) {
        await updateControlMutation.mutateAsync({ id: editingItem.id, ...payload });
      } else {
        await createControlMutation.mutateAsync(payload as any);
      }

      toast.success(editingItem ? "Nazorat yangilandi!" : "Nazorat qo'shildi!");
    } catch (err: any) {
      if (err.errorFields) {
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
          originFileObj: file,
        },
      ]);
      return false;
    },
  };

  return (
    <div className="bg-white">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Title level={2} className="!mb-0 font-semibold">
            Nazorat Ishlari
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="bg-blue-600 shadow-md hover:bg-blue-700"
            onClick={openModal}
          >
            Nazorat qo'shish
          </Button>
        </div>

        {isControlLoading ? (
          <div className="flex justify-center py-32">
            <Spin size="large" />
          </div>
        ) : controles.length === 0 ? (
          <Empty description="Hozircha nazorat ishlari mavjud emas" className="py-24">
            <Button type="primary" size="large" onClick={openModal}>
              Birinchi nazoratni qo'shish
            </Button>
          </Empty>
        ) : (
          <>
            <div className="space-y-4">
              {controles.map((item, index) => {
                const isExpanded = expandedCards[item.id];
                const shouldShowToggle = (item.description?.length || 0) > 150;
                const displayDesc =
                  isExpanded || !shouldShowToggle
                    ? item.description
                    : item.description?.substring(0, 150) + "...";

                return (
                  <div
                    key={item.id}
                    className="relative flex items-start justify-between w-full p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
                  >
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow"
                        onClick={() => handleEdit(item)}
                      >
                        Tahrirlash
                      </Button>
                      <Popconfirm
                        title="Nazoratni o'chirish"
                        description="Haqiqatan ham o'chirmoqchimisiz?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Ha"
                        cancelText="Yo'q"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger size="small" icon={<DeleteOutlined />}>
                          O'chirish
                        </Button>
                      </Popconfirm>
                    </div>

                    <div className="flex items-start gap-4 flex-1 pr-20">
                      <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow">
                        {currentPage * pageSize + index + 1}
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-gray-900 font-semibold text-sm !m-0">{item.name}</p>

                        {item.description && (
                          <div>
                            <p className="text-gray-600 text-xs !m-0">
                              {displayDesc || "Tavsif yo'q"}
                            </p>
                            {shouldShowToggle && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium mt-1"
                              >
                                {isExpanded ? "Kamroq" : "Ko'proq"} ko'rish
                              </button>
                            )}
                          </div>
                        )}

                        <p className="text-gray-600 text-xs !m-0">
                          Tadqiqotchi: <span className="font-medium">{item.researcherName}</span>
                        </p>
                        {item.univerName && (
                          <p className="text-gray-600 text-xs italic !m-0">
                            Universitet: <span className="font-medium">{item.univerName}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                            {item.year}
                          </span>
                          {item.level && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              {item.level}
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${
                              item.finished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.finished ? "Tugallandi" : "Jarayonda"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 shadow-sm hover:shadow transition flex-shrink-0"
                      >
                        <DownloadOutlined className="text-lg" />
                        <span className="text-[13px] font-medium">PDF Fayli</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {total > pageSize && (
              <div className="flex justify-end mt-8">
                <Pagination
                  current={currentPage + 1}
                  total={total}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page - 1)}
                  showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} ta`}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}

        <Modal
          title={
            <Title level={3}>
              {editingItem ? "Nazoratni tahrirlash" : "Yangi nazorat qo'shish"}
            </Title>
          }
          open={isOpen}
          onCancel={() => {
            closeModal();
            form.resetFields();
            setFileList([]);
            setEditingItem(null);
          }}
          footer={null}
          width={720}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                name="name"
                label="Nazorat nomi"
                rules={[{ required: true, message: "Nomini kiriting!" }]}
              >
                <Input size="large" placeholder="Masalan: Magistrlik dissertatsiyasi..." />
              </Form.Item>

              <Form.Item name="description" label="Tavsif">
                <TextArea rows={3} placeholder="Qisqacha tavsif..." />
              </Form.Item>

              <Form.Item
                name="researcherName"
                label="Tadqiqotchi"
                rules={[{ required: true, message: "Ism familiya kiriting!" }]}
              >
                <Input size="large" placeholder="A. X. Xo'jayev" />
              </Form.Item>

              <Form.Item name="univerName" label="Universitet">
                <Input size="large" placeholder="TATU, INHA..." />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="year"
                  label="Yil"
                  rules={[
                    { required: true, message: "Yilni kiriting!" },
                    { pattern: /^(19|20|21)\d{2}$/, message: "1900–2100 oralig'ida yil kiriting!" },
                    { len: 4, message: "Yil 4 ta raqamdan iborat bo'lishi kerak!" },
                  ]}
                >
                  <Input
                    type="number"
                    size="large"
                    placeholder="2025"
                    min={1900}
                    max={2100}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onInput={(e: any) => e.target.value.length > 4 && (e.target.value = e.target.value.slice(0, 4))}
                  />
                </Form.Item>

                <Form.Item name="level" label="Daraja">
                  <Select size="large" placeholder="Tanlang" allowClear>
                    <Select.Option value="Usta">Usta</Select.Option>
                    <Select.Option value="O'rta">O'rta</Select.Option>
                    <Select.Option value="Boshlang'ich">Boshlang'ich</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="finished" label="Holati" initialValue={false}>
                <Select size="large">
                  <Select.Option value={false}>Jarayonda</Select.Option>
                  <Select.Option value={true}>Tugallandi</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="PDF yuklash (ixtiyoriy)" extra="Yoki havolani kiriting">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">PDFni bosing yoki sudrab keling</p>
                  <p className="ant-upload-hint">Faqat PDF, maksimal 10MB</p>
                </Dragger>
              </Form.Item>

              <Form.Item name="fileUrl" label="PDF havolasi">
                <Input
                  size="large"
                  placeholder="https://example.com/file.pdf"
                  disabled={fileList.length > 0}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={closeModal}>Bekor qilish</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  createControlMutation.isPending ||
                  updateControlMutation.isPending ||
                  uploadPDFMutation.isPending
                }
              >
                {editingItem ? "Saqlash" : "Qo'shish"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Control;