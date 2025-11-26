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
import { useAwardOperations } from "../../../hooks/useAwardOperation";
import Dragger from "antd/es/upload/Dragger";
import { toast } from "sonner";

const { Title } = Typography;
const { TextArea } = Input;

const Award: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingAward, setEditingAward] = useState<any>(null);

  const {
    awards,
    total,
    isAwardLoading,
    createAwardMutation,
    updateAwardMutation,
    deleteAwardMutation,
    uploadPDFMutation,
    refetch,
  } = useAwardOperations(
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
    setEditingAward(null);
  };

  const handleOpenEditModal = (award: any) => {
    setEditingAward(award);
    form.setFieldsValue({
      name: award.name,
      description: award.description,
      year: award.year,
      awardEnum: award.awardEnum,
      memberEnum: award.memberEnum,
      fileUrl: award.fileUrl,
    });
    setFileList(
      award.fileUrl
        ? [
            {
              uid: "-1",
              name: "Mavjud PDF",
              status: "done",
              url: award.fileUrl,
            },
          ]
        : []
    );
    openModal();
  };

  const handleDelete = async (awardId: number) => {
    try {
      await deleteAwardMutation.mutateAsync(awardId);
      toast.success("Mukofot muvaffaqiyatli o‘chirildi");
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
          finalPdfUrl = await uploadPDFMutation.mutateAsync(fileList[0].originFileObj as File);
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
        awardEnum: values.awardEnum,
        memberEnum: values.memberEnum,
      };

      if (editingAward) {
        await updateAwardMutation.mutateAsync({
          id: editingAward.id,
          ...data,
        });
        toast.success("Mukofot yangilandi");
      } else {
        await createAwardMutation.mutateAsync(data);
        toast.success("Yangi mukofot qo‘shildi");
      }

      handleCloseModal();
    } catch (error: any) {
      if (error.errorFields) {
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
              Mukofotlar
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="bg-blue-600 shadow-md hover:bg-blue-700"
              onClick={openModal}
            >
              Mukofot qo‘shish
            </Button>
          </div>

          {/* Loading yoki Empty */}
          {isAwardLoading ? (
            <div className="flex justify-center py-32">
              <Spin />
            </div>
          ) : awards.length === 0 ? (
            <Empty description="Hozircha mukofotlar mavjud emas" className="py-24">
              <Button type="primary" onClick={openModal}>
                Birinchi mukofotni qo‘shish
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {awards.map((item, index) => (
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
                      title="Mukofotni o‘chirish"
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
                        loading={deleteAwardMutation.isPending}
                      >
                        O‘chirish
                      </Button>
                    </Popconfirm>
                  </div>

                  {/* Chap qism */}
                  <div className="flex items-start gap-4 flex-1 pr-4">
                    <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow">
                      {currentPage * pageSize + index + 1}
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="text-gray-600 text-xs !m-0">{item.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                          {item.year}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {item.awardEnum === "Trening_Va_Amaliyot" ? "Traning va amaliyot" : item.awardEnum}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {item.memberEnum}
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
                      <span className="text-[13px] font-medium">PDF Fayli</span>
                    </a>
                  )}
                </div>
              ))}
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
                showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} ta`}
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
            {editingAward ? "Mukofotni tahrirlash" : "Yangi mukofot qo‘shish"}
          </Title>
        }
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
              label="Mukofot nomi"
              rules={[{ required: true, message: "Mukofot nomini kiriting!" }]}
            >
              <Input size="large" placeholder="Masalan: Respublika olimpiadasi 1-o‘rin" />
            </Form.Item>

            <Form.Item name="description" label="Qisqa tavsif">
              <TextArea rows={3} placeholder="Mukofot haqida qisqacha ma'lumot..." />
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
                name="awardEnum"
                label="Mukofot turi"
                rules={[{ required: true, message: "Turini tanlang!" }]}
              >
                <Select size="large" placeholder="Tanlang">
                  <Select.Option value="Trening_Va_Amaliyot">
                    Trening va amaliyot
                  </Select.Option>
                  {/* Agar boshqa enum qiymatlari qo‘shilsa, shu yerga qo‘shiladi */}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="memberEnum"
              label="A'zolik darajasi"
              rules={[{ required: true, message: "Darajani tanlang!" }]}
            >
              <Select size="large" placeholder="Tanlang">
                <Select.Option value="MILLIY">Milliy</Select.Option>
                <Select.Option value="XALQARO">Xalqaro</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="PDF yuklash (ixtiyoriy)" extra="Yoki havolani quyida kiriting">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">PDFni bosing yoki sudrab keling</p>
                <p className="ant-upload-hint">Faqat PDF, maksimal 10MB</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="fileUrl"
              label="Yoki PDF havolasini kiriting"
              extra="Yuqorida fayl yuklasangiz, bu maydonni to‘ldirish shart emas"
            >
              <Input
                size="large"
                placeholder="https://example.com/diplom.pdf"
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
                createAwardMutation.isPending ||
                updateAwardMutation.isPending ||
                uploadPDFMutation.isPending
              }
            >
              {editingAward ? "Saqlash" : "Qo‘shish"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Award;