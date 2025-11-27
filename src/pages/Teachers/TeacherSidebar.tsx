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
import { toast } from "sonner"; // YANGI IMPORT

const { Dragger } = Upload;
const { TextArea } = Input;

interface TeacherFormValues {
  id?: number;
  fullName: string;
  phoneNumber: string;
  biography: string;
  imgUrl: string;
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
    } else {
      setCurrentEditMode(false);
      form.resetFields();
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
        let uploadedPDFUrl = initialValues.imgUrl || ""; // agar oldin pdf bo'lsa

        if (fileList.length > 0 && fileList[0].originFileObj) {
          toast.loading("Rasm yuklanmoqda...");
          const imageData = await uploadImageMutation.mutateAsync(fileList[0].originFileObj);
          uploadedImageUrl = imageData || "";
          toast.dismiss();
          toast.success("Rasm yuklandi!");
        }

        if (PDFfile.length > 0 && PDFfile[0].originFileObj) {
          toast.loading("PDF yuklanmoqda...");
          const pdfUrl = await uploadPDFMutation.mutateAsync(PDFfile[0].originFileObj);
          uploadedPDFUrl = pdfUrl || "";
          toast.dismiss();
          toast.success("PDF yuklandi!");
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

        toast.loading("Ustoz ma'lumotlari yangilanmoqda...");
        await updateMutation?.mutateAsync(updateData);
        toast.dismiss();
        toast.success("Ustoz muvaffaqiyatli tahrirlandi!");

        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["age-distribution"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        handleClose();
      } else {
        // CREATE MODE
        let uploadedImageUrl = "";
        let uploadedPDFUrls: string[] = [];

        if (fileList.length === 0) {
          toast.error("Ustozning rasmini yuklang!");
          return;
        }

        toast.loading("Rasm yuklanmoqda...");
        const imageData = await uploadImageMutation.mutateAsync(fileList[0].originFileObj!);
        uploadedImageUrl = imageData || "";
        toast.dismiss();
        toast.success("Rasm yuklandi!");

        if (PDFfile.length > 0) {
          toast.loading("PDF fayllar yuklanmoqda...");
          for (const file of PDFfile) {
            if (file.originFileObj) {
              const pdfUrl = await uploadPDFMutation.mutateAsync(file.originFileObj);
              uploadedPDFUrls.push(pdfUrl);
            }
          }
          toast.dismiss();
          toast.success("Barcha PDF yuklandi!");
        }

        const formData: any = {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          biography: values.biography || "",
          imgUrl: uploadedImageUrl,
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

        toast.loading("Yangi ustoz qo'shilmoqda...");
        await createMutation.mutateAsync(formData);
        toast.dismiss();
        toast.success("Yangi ustoz muvaffaqiyatli qo'shildi!");

        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["age-distribution"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Ma'lumotlarni saqlashda xatolik yuz berdi!");
      console.error("Submission error:", error);
    }
  };

  const draggerProps: UploadProps = {
    name: "teacherImage",
    multiple: false,
    fileList,
    maxCount: 1,
    beforeUpload: (file: File) => {
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
    onRemove: () => {
      setFileList([]);
    },
  };

  const draggerPropsPDF: UploadProps = {
    name: "teacherPDF",
    multiple: true,
    fileList: PDFfile,
    beforeUpload: (file: File & { uid?: string }) => {
      const isAllowedType =
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isAllowedType) {
        toast.error("Faqat PDF yoki DOCX fayllarni yuklash mumkin!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error("Har bir fayl hajmi 5MB dan kichik bo'lishi kerak!");
        return Upload.LIST_IGNORE;
      }

      setPDFfile((prev) => [
        ...prev,
        {
          uid: file.uid || String(Date.now()),
          name: file.name,
          status: "done",
          originFileObj: file,
        } as UploadFile,
      ]);

      return false;
    },
    onRemove: (file) => {
      setPDFfile((prev) => prev.filter((item) => item.uid !== file.uid));
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
      width={480}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} size="large" disabled={isLoading}>
            Bekor qilish
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            size="large"
          >
            {currentEditMode ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        {/* Barcha Form.Item lar oʻzgarmadi – faqat toastlar oʻzgardi */}
        {/* ... oldingi formalar ... */}
        {/* Men ularni qisqartirdim, lekin oʻzgarmadi */}
      </Form>
    </Drawer>
  );
};