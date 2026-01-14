// components/teacher/TeacherSidebar.tsx
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Radio,
  InputNumber,
} from "antd";
import { useDrawerStore } from "../../stores/useDrawerStore";
import { InboxOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner"; // Sonner import

const { Dragger } = Upload;
const { TextArea } = Input;

interface TeacherFormValues {
  id?: number;
  fullName: string;
  phoneNumber: string;
  biography: string;
  imgUrl: string;
  fileUrl: string;
  input: string;
  profession: string;
  lavozmId: number;
  email: string;
  age: number | string;
  gender: boolean | string;
  password?: string;
  departmentId: number;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

interface TeacherSidebarProps {
  initialValues?: Partial<TeacherFormValues>;
  editMode?: boolean;
  departmentList?: Department[];
  positionList?: Position[];
  createMutation: UseMutationResult<any, any, any, any>;
  updateMutation?: UseMutationResult<any, any, any, any>;
  uploadImageMutation: UseMutationResult<any, any, File, any>;
  uploadPDFMutation: UseMutationResult<any, any, File, any>;
}

export const TeacherSidebar = ({
  initialValues,
  departmentList = [],
  positionList = [],
  createMutation,
  updateMutation,
  uploadImageMutation,
  uploadPDFMutation,
}: TeacherSidebarProps) => {
  const { isOpen, closeDrawer } = useDrawerStore();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [PDFfile, setPDFfile] = useState<UploadFile[]>([]);
  const [currentEditMode, setCurrentEditMode] = useState(false);
  const queryClient = useQueryClient();

  // Edit mode va initial values
  useEffect(() => {
    if (isOpen && initialValues?.id) {
      setCurrentEditMode(true);

      form.setFieldsValue({
        fullName: initialValues.fullName ?? "",
        email: initialValues.email ?? "",
        phoneNumber: initialValues.phoneNumber ?? "",
        age: initialValues.age ?? 18,
        gender:
          typeof initialValues.gender === "boolean"
            ? initialValues.gender
              ? "male"
              : "female"
            : "male",
        profession: initialValues.profession ?? "",
        biography: initialValues.biography ?? "",
        input: initialValues.input ?? "",
        departmentId: initialValues.departmentId ?? undefined,
        lavozmId: initialValues.lavozmId ?? undefined,
      });

      // Agar oldin rasm boʻlsa, koʻrsatish
      if (initialValues.imgUrl) {
        setFileList([
          {
            uid: "-1",
            name: "Oldingi rasm",
            status: "done",
            url: initialValues.imgUrl,
          },
        ]);
      }
    } else {
      setCurrentEditMode(false);
      form.resetFields();
      setFileList([]);
      setPDFfile([]);
    }
  }, [isOpen, initialValues, form]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setPDFfile([]);
    setCurrentEditMode(false);
    closeDrawer();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (currentEditMode && initialValues?.id) {
        // EDIT MODE
        let uploadedImageUrl = initialValues.imgUrl || "";
        let uploadedPDFUrl =
          initialValues.fileUrl || initialValues.imgUrl || "";

        // Yangi rasm yuklash
        if (fileList.length > 0 && fileList[0].originFileObj) {
          const imageData = await uploadImageMutation.mutateAsync(
            fileList[0].originFileObj!
          );
          uploadedImageUrl = imageData;
          toast.dismiss();
        }

        // Yangi PDF yuklash
        if (PDFfile.length > 0 && PDFfile[0].originFileObj) {
          const pdfUrl = await uploadPDFMutation.mutateAsync(
            PDFfile[0].originFileObj!
          );
          uploadedPDFUrl = pdfUrl;
          toast.dismiss();
        }

        const updateData = {
          id: initialValues.id,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          biography: values.biography || "",
          imgUrl: uploadedImageUrl,
          input: values.input || "",
          profession: values.profession || "",
          lavozmId: Number(values.lavozmId),
          email: values.email,
          age: values.age,
          gender: values.gender === "male",
          departmentId: Number(values.departmentId),
          fileUrl: uploadedPDFUrl,
        };

        await updateMutation?.mutateAsync(updateData);
        toast.dismiss();

        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["age-distribution"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        handleClose();
      } else {
        // CREATE MODE
        if (fileList.length === 0) {
          toast.error("Iltimos, ustozning rasmini yuklang!");
          return;
        }

        const imageData = await uploadImageMutation.mutateAsync(
          fileList[0].originFileObj!
        );
        toast.dismiss();

        let uploadedPDFUrls: string[] = [];
        if (PDFfile.length > 0) {
          for (const file of PDFfile) {
            if (file.originFileObj) {
              const pdfUrl = await uploadPDFMutation.mutateAsync(
                file.originFileObj
              );
              uploadedPDFUrls.push(pdfUrl);
            }
          }
          toast.dismiss();
        }

        const formData = {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          biography: values.biography || "",
          imgUrl: imageData,
          input: values.input || "",
          profession: values.profession || "",
          lavozmId: Number(values.lavozmId),
          email: values.email,
          age: Number(values.age),
          gender: values.gender === "male",
          password: values.password,
          departmentId: Number(values.departmentId),
          pdfUrls: uploadedPDFUrls,
        };

        await createMutation.mutateAsync(formData);
        toast.dismiss();

        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["age-distribution"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        handleClose();
      }
    } catch (error: any) {
      toast.error(
        error.message || "Ma'lumotlarni saqlashda xatolik yuz berdi!"
      );
      console.error("Xatolik:", error);
    }
  };

  // Rasm yuklash
  const draggerProps: UploadProps = {
    name: "teacherImage",
    multiple: false,
    fileList,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.error("Faqat rasm yuklash mumkin! (JPG, PNG, JPEG)");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

      setFileList([
        {
          uid: "-1",
          name: file.name,
          status: "done",
          originFileObj: file,
        } as UploadFile,
      ]);
      return false;
    },
    onRemove: () => setFileList([]),
  };

  // PDF yuklash
  const draggerPropsPDF: UploadProps = {
    name: "teacherPDF",
    multiple: true,
    fileList: PDFfile,
    beforeUpload: (file) => {
      const isAllowed =
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isAllowed) {
        toast.error("Faqat PDF yoki DOCX fayllar yuklanadi!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error("Fayl hajmi 5MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

      setPDFfile((prev) => [
        ...prev,
        {
          uid: file.uid || Date.now().toString(),
          name: file.name,
          status: "done",
          originFileObj: file,
        } as UploadFile,
      ]);
      return false;
    },
    onRemove: (file) => {
      setPDFfile((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation?.isPending ||
    uploadImageMutation.isPending ||
    uploadPDFMutation.isPending;

  return (
    <Drawer
      title={currentEditMode ? "Ustozni tahrirlash" : "Yangi ustoz qo'shish"}
      placement="right"
      onClose={handleClose}
      open={isOpen}
      width={520}
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={handleClose} size="large" disabled={isLoading}>
            Bekor qilish
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            size="large"
          >
            {currentEditMode ? "Saqlash" : "Qo‘shish"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        {/* Barcha formalar */}
        <Form.Item
          label="To'liq ism"
          name="fullName"
          rules={[{ required: true, message: "Ism kiriting!" }]}
        >
          <Input placeholder="Ism Familiya" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "To'g'ri email kiriting!",
            },
          ]}
        >
          <Input placeholder="email@example.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Telefon raqami"
          name="phoneNumber"
          rules={[{ required: true }]}
        >
          <Input placeholder="+998 XX XXX XX XX" size="large" />
        </Form.Item>

        <Form.Item label="Yosh" name="age" rules={[{ required: true }]}>
          <InputNumber
            min={18}
            max={100}
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item label="Jins" name="gender" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="male">Erkak</Radio>
            <Radio value="female">Ayol</Radio>
          </Radio.Group>
        </Form.Item>

        {!currentEditMode && (
          <Form.Item
            label="Parol"
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password size="large" />
          </Form.Item>
        )}

        <Form.Item
          label="Kafedra"
          name="departmentId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Kafedra tanlang"
            size="large"
            options={departmentList.map((d) => ({
              value: d.id,
              label: d.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Lavozim" name="lavozmId" rules={[{ required: true }]}>
          <Select
            placeholder="Lavozim tanlang"
            size="large"
            options={positionList.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>

        <Form.Item
          label="Biografiya"
          name="biography"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} placeholder="Qisqacha biografiya" showCount />
        </Form.Item>

        <Form.Item
          label="Qo'shimcha ma'lumot"
          name="input"
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Mutaxassisligi"
          name="profession"
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Rasm"
          rules={[{ required: !currentEditMode, message: "Rasm yuklang!" }]}
        >
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Rasmni bosing yoki sudrab keling</p>
            <p className="ant-upload-hint">JPG, PNG, JPEG • Max 5MB</p>
          </Dragger>
        </Form.Item>

        <Form.Item
          label="Fayllar (PDF/DOCX)"
          rules={[
            {
              required: !currentEditMode,
              message: "Kamida 1 ta fayl yuklang!",
            },
          ]}
        >
          <Dragger {...draggerPropsPDF}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">PDF yoki DOCX yuklang</p>
            <p className="ant-upload-hint">
              Bir nechta fayl • Har biri max 5MB
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
