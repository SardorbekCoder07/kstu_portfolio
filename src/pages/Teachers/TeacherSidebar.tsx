// components/teacher/TeacherSidebar.tsx
import { Drawer, Form, Input, Select, Button, Upload, message } from 'antd';
import { useDrawerStore } from '../../stores/useDrawerStore';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Option } = Select;
const { Dragger } = Upload;

interface TeacherFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  position: string;
  degree: string;
  image?: File;
}

interface TeacherSidebarProps {
  onSubmit?: (values: TeacherFormValues) => void;
  loading?: boolean;
  initialValues?: Partial<TeacherFormValues>;
  editMode?: boolean;
}

export const TeacherSidebar = ({
  onSubmit,
  loading = false,
  initialValues,
  editMode = false,
}: TeacherSidebarProps) => {
  const { isOpen, closeDrawer } = useDrawerStore();
  const [form] = Form.useForm();

  // ✅ Rasm uchun state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setSelectedFile(null);
    closeDrawer();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // ✅ Barcha ma'lumotlarni birlashtirish
      const formData: TeacherFormValues = {
        ...values,
        image: selectedFile || undefined,
      };

      // ✅ Console ga chiqarish
      console.log('📝 Form Values:', formData);
      console.log('🖼️ Image File:', selectedFile);
      console.log('👤 First Name:', formData.firstName);
      console.log('👤 Last Name:', formData.lastName);
      console.log('📧 Email:', formData.email);
      console.log('📱 Phone:', formData.phone);
      console.log('🏛️ Faculty:', formData.faculty);
      console.log('📚 Department:', formData.department);
      console.log('💼 Position:', formData.position);
      console.log('🎓 Degree:', formData.degree);

      onSubmit?.(formData);
      handleClose();
    } catch (error) {
      console.error('❌ Validation failed:', error);
    }
  };

  // ✅ Rasm yuklash konfiguratsiyasi
  const draggerProps: UploadProps = {
    name: 'teacherImage',
    multiple: false,
    fileList,
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Faqat rasm yuklash mumkin!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
        return false;
      }

      setFileList([file as any]);
      setSelectedFile(file);
      return false; // Avtomatik yuklashni to'xtatish
    },
    onRemove: () => {
      setFileList([]);
      setSelectedFile(null);
    },
  };

  // Mock data
  const faculties = [
    { id: 1, name: 'Axborot texnologiyalari fakulteti' },
    { id: 2, name: 'Iqtisodiyot fakulteti' },
    { id: 3, name: 'Filologiya fakulteti' },
  ];

  const departments = [
    { id: 1, name: 'Dasturiy injiniring' },
    { id: 2, name: 'Axborot xavfsizligi' },
    { id: 3, name: "Sun'iy intellekt" },
  ];

  const positions = [
    { value: 'professor', label: 'Professor' },
    { value: 'dotsent', label: 'Dotsent' },
    { value: 'katta_oqituvchi', label: "Katta o'qituvchi" },
    { value: 'oqituvchi', label: "O'qituvchi" },
    { value: 'assistent', label: 'Assistent' },
  ];

  const degrees = [
    { value: 'fan_doktori', label: 'Fan doktori' },
    { value: 'fan_nomzodi', label: 'Fan nomzodi' },
    { value: 'phd', label: 'PhD' },
    { value: 'dsc', label: 'DSc' },
    { value: 'magistr', label: 'Magistr' },
  ];

  return (
    <Drawer
      title={editMode ? 'Ustozni tahrirlash' : "Yangi ustoz qo'shish"}
      placement="right"
      onClose={handleClose}
      open={isOpen}
      width={480}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} size="large">
            Bekor qilish
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            {editMode ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        autoComplete="off"
      >
        <Form.Item
          label="Ism"
          name="firstName"
          rules={[{ required: true, message: 'Iltimos, ism kiriting!' }]}
        >
          <Input placeholder="Ismni kiriting" size="large" />
        </Form.Item>

        <Form.Item
          label="Familiya"
          name="lastName"
          rules={[{ required: true, message: 'Iltimos, familiya kiriting!' }]}
        >
          <Input placeholder="Familiyani kiriting" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Iltimos, email kiriting!' },
            { type: 'email', message: "To'g'ri email kiriting!" },
          ]}
        >
          <Input placeholder="email@example.com" size="large" type="email" />
        </Form.Item>

        <Form.Item
          label="Telefon raqami"
          name="phone"
          rules={[
            { required: true, message: 'Iltimos, telefon raqami kiriting!' },
          ]}
        >
          <Input placeholder="+998 XX XXX XX XX" size="large" maxLength={13} />
        </Form.Item>

        <Form.Item
          label="Fakultet"
          name="faculty"
          rules={[{ required: true, message: 'Iltimos, fakultet tanlang!' }]}
        >
          <Select
            placeholder="Fakultetni tanlang"
            size="large"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={faculties.map(faculty => ({
              value: faculty.id,
              label: faculty.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Kafedra"
          name="department"
          rules={[{ required: true, message: 'Iltimos, kafedra tanlang!' }]}
        >
          <Select
            placeholder="Kafedrani tanlang"
            size="large"
            showSearch
            suffixIcon={<SearchOutlined />}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={departments.map(dept => ({
              value: dept.id,
              label: dept.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Lavozim"
          name="position"
          rules={[{ required: true, message: 'Iltimos, lavozim tanlang!' }]}
        >
          <Select
            placeholder="Lavozimni tanlang"
            size="large"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {positions.map(position => (
              <Option key={position.value} value={position.value}>
                {position.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ilmiy daraja"
          name="degree"
          rules={[
            { required: true, message: 'Iltimos, ilmiy daraja tanlang!' },
          ]}
        >
          <Select
            placeholder="Ilmiy darajani tanlang"
            size="large"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {degrees.map(degree => (
              <Option key={degree.value} value={degree.value}>
                {degree.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* ✅ Rasm yuklash */}
        <Form.Item label="Rasm">
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Rasmni yuklash uchun bosing yoki sudrab keling
            </p>
            <p className="ant-upload-hint">
              Faqat JPG, PNG, JPEG formatdagi rasmlar. Maksimal hajm: 5MB
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
