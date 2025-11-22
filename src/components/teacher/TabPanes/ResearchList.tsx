import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Spin,
  Modal,
  Button,
  message,
  Form,
  Input,
  Select,
  Upload,
  Card,
  Tag,
  Empty,
  Typography,
} from "antd";
import { UploadOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  fetchResearch,
  createResearch,
  ResearchItem,
  uploadTeacherPDF,
} from "../../../api/pagesApi/researchApi";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ResearchList: React.FC = () => {
  const queryClient = useQueryClient();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: research = [], isLoading } = useQuery<ResearchItem[]>({
    queryKey: ["researchList"],
    queryFn: fetchResearch,
    staleTime: 1000 * 60 * 3,
  });

  const createMutation = useMutation({
    mutationFn: createResearch,
    onSuccess: () => {
      message.success("Tadqiqot muvaffaqiyatli qo‘shildi!");
      queryClient.invalidateQueries({ queryKey: ["researchList"] });
      handleCloseModal();
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Tadqiqot qo‘shishda xatolik yuz berdi"
      );
    },
  });

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let finalFileUrl = values.fileUrl?.trim();

      // Agar fayl tanlangan bo‘lsa – yuklaymiz
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as File;
        message.loading("PDF yuklanmoqda...", 0);
        try {
          finalFileUrl = await uploadTeacherPDF(file);
          message.destroy();
          message.success("PDF muvaffaqiyatli yuklandi");
        } catch (err) {
          message.destroy();
          message.error("PDF yuklashda xatolik!");
          return;
        }
      }

      createMutation.mutate({
        name: values.name,
        description: values.description || "",
        year: Number(values.year),
        fileUrl: finalFileUrl || "",
        userId: 1, // keyincha auth dan olinadi
        member: true,
        univerName: values.univerName,
        finished: values.finished,
        memberEnum: values.memberEnum,
      });
    } catch (error) {
      // Form validatsiya xatosi
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
      return false; // avto-upload o‘chirilgan
    },
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Title level={3} className="!mb-0">
              Ilmiy tadqiqotlar
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={openModal}
            >
              Yangi tadqiqot qo‘shish
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : research.length === 0 ? (
            <Empty description="Hozircha tadqiqotlar mavjud emas" className="py-20">
              <Button type="primary" onClick={openModal}>
                Birinchi tadqiqotni qo‘shish
              </Button>
            </Empty>
          ) : (
            <div className="grid gap-5">
              {research.map((item, index) => (
                <Card key={item.id} hoverable className="shadow-md">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Title level={5} className="!mt-0 !mb-2">
                          {item.name}
                        </Title>
                        <Text type="secondary" className="block mb-3">
                          {item.description || "Tavsif kiritilmagan"}
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          <Tag color="volcano">{item.year}</Tag>
                          <Tag color="green">{item.member ? "A'zo" : "A'zo emas"}</Tag>
                          <Tag color="blue">{item.memberEnum}</Tag>
                          <Tag color="purple">{item.univerName}</Tag>
                          <Tag color={item.finished ? "success" : "processing"}>
                            {item.finished ? "Tugallangan" : "Jarayonda"}
                          </Tag>
                        </div>
                      </div>
                    </div>

                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition"
                      >
                        <DownloadOutlined className="text-lg" />
                        PDF
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={<Title level={4}>Yangi tadqiqot qo‘shish</Title>}
        open={isOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            year: new Date().getFullYear(),
            memberEnum: "MILLIY",
            finished: false,
          }}
        >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Input size="large" placeholder="TATU, Inha University..." />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Form.Item label="PDF fayl yuklash (ixtiyoriy)">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>PDF tanlash (.pdf)</Button>
            </Upload>
            <Text type="secondary" className="text-xs block mt-2">
              Yoki quyidagi maydonchaga havola joylashtiring
            </Text>
          </Form.Item>

          <Form.Item name="fileUrl" label="PDF havolasi (agar yuklamasangiz)">
            <Input size="large" placeholder="https://example.com/file.pdf" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={handleCloseModal}>Bekor qilish</Button>
            <Button
              type="primary"
              size="large"
              loading={createMutation.isPending}
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

export default ResearchList;