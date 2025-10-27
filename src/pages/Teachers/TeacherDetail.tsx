import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Avatar,
  Tabs,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Space,
  Upload,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const { TextArea } = Input;
const { Option } = Select;

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState(null);

  // Fetch teacher data
  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      // API call will be here
      // const response = await fetch(`/api/teachers/${id}`);
      // const data = await response.json();
      // setTeacher(data);

      // Temporary demo data
      setTeacher({
        id,
        firstName: 'Aziz',
        lastName: 'Karimov',
        email: 'aziz.karimov@example.com',
        phone: '+998 90 123 45 67',
        faculty: 'Kompyuter fanlari',
        department: 'Dasturiy injiniring',
        position: 'Dotsent',
        degree: 'Texnika fanlari nomzodi',
        image: null,
        courses: ['Web dasturlash', "Ma'lumotlar bazasi"],
        experience: '10 yil',
        birthDate: '1985-05-15',
        address: 'Toshkent, Chilonzor tumani',
        passport: 'AA1234567',
        nationality: "O'zbekiston",
        maritalStatus: 'Turmush qurgan',
        education: 'Oliy',
        graduatedFrom: 'TATU',
        graduationYear: '2007',
        specialization: 'Dasturiy injiniring',
        workStartDate: '2010-09-01',
        contractNumber: 'CT-2023-001',
        salary: '5000000',
        bankAccount: '12345678901234567890',
        publications: '15',
        projects: '8',
        awards: "Eng yaxshi o'qituvchi 2022",
        documents: [],
      });
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/teachers');

  const handleEdit = () => setEditMode(!editMode);

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call will be here
      // await fetch(`/api/teachers/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(teacher),
      // });

      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi");
      setEditMode(false);
    } catch (error) {
      toast.error('Saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTeacher(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = info => {
    const { status, response } = info.file;
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    if (status === 'done') {
      // Get this url from response in real world.
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTeacher(prev => ({ ...prev, image: reader.result }));
        setLoading(false);
        toast.success('Rasm muvaffaqiyatli yuklandi');
      });
      reader.readAsDataURL(info.file.originFileObj);
    } else if (status === 'error') {
      setLoading(false);
      toast.error('Rasmni yuklashda xatolik');
    }
  };

  const handleFileUpload = info => {
    const { status, response } = info.file;
    if (status === 'done') {
      toast.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
      // API response will contain file URL
      // setTeacher(prev => ({
      //   ...prev,
      //   documents: [...prev.documents, response.fileUrl]
      // }));
    } else if (status === 'error') {
      toast.error(`${info.file.name} faylni yuklashda xatolik`);
    }
  };

  const imageUploadProps = {
    name: 'image',
    action: '/api/upload/image', // Your image upload API endpoint
    accept: 'image/*',
    showUploadList: false,
    onChange: handleImageUpload,
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Faqat rasm fayllarini yuklash mumkin!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
      }
      return isImage && isLt5M;
    },
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload', // Your upload API endpoint
    accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx',
    onChange: handleFileUpload,
    beforeUpload: file => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ].includes(file.type);

      if (!isValidType) {
        message.error(
          'Faqat PDF, DOC, DOCX, XLS, XLSX, TXT formatdagi fayllar qabul qilinadi!'
        );
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Fayl hajmi 10MB dan kichik bo'lishi kerak!");
      }

      return isValidType && isLt10M;
    },
  };

  const renderField = (label, field, type = 'text', options = {}) => (
    <Col xs={24} md={12}>
      <label className="block mb-2 font-semibold">{label}</label>
      {type === 'select' ? (
        <Select
          value={teacher?.[field]}
          onChange={value => handleInputChange(field, value)}
          disabled={!editMode}
          size="large"
          className="w-full"
        >
          {options.items?.map(item => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      ) : type === 'textarea' ? (
        <TextArea
          value={teacher?.[field]}
          onChange={e => handleInputChange(field, e.target.value)}
          disabled={!editMode}
          rows={options.rows || 3}
          size="large"
          placeholder={options.placeholder}
        />
      ) : (
        <Input
          value={teacher?.[field]}
          onChange={e => handleInputChange(field, e.target.value)}
          disabled={!editMode}
          size="large"
          type={type}
          suffix={options.suffix}
          placeholder={options.placeholder}
        />
      )}
    </Col>
  );

  const mainTabItems = [
    {
      key: '1',
      label: "Shaxsiy ma'lumotlar",
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Asosiy',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Ism', 'firstName')}
                  {renderField('Familiya', 'lastName')}
                  {renderField('Email', 'email', 'email')}
                  {renderField('Telefon', 'phone')}
                  {renderField("Tug'ilgan sana", 'birthDate', 'date')}
                  {renderField('Millati', 'nationality')}
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Passport',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Passport seriya raqami', 'passport')}
                  {renderField('Fuqaroligi', 'nationality')}
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Yashash manzili
                    </label>
                    <TextArea
                      value={teacher?.address}
                      onChange={e =>
                        handleInputChange('address', e.target.value)
                      }
                      disabled={!editMode}
                      rows={3}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: '3',
              label: 'Oilaviy ahvol',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Oilaviy holati', 'maritalStatus', 'select', {
                    items: [
                      { value: 'Turmush qurmagan', label: 'Turmush qurmagan' },
                      { value: 'Turmush qurgan', label: 'Turmush qurgan' },
                      { value: 'Ajrashgan', label: 'Ajrashgan' },
                    ],
                  })}
                </Row>
              ),
            },
            {
              key: '4',
              label: 'Hujjatlar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Hujjatlar yuklash
                    </label>
                    <Upload {...uploadProps} disabled={!editMode}>
                      <Button
                        icon={<UploadOutlined />}
                        disabled={!editMode}
                        size="large"
                      >
                        Fayl yuklash (PDF, DOC, DOCX, XLS, XLSX)
                      </Button>
                    </Upload>
                    {teacher?.documents?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Yuklangan fayllar:</p>
                        <Space direction="vertical">
                          {teacher.documents.map((doc, idx) => (
                            <Tag key={idx} color="blue">
                              {doc}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: '2',
      label: "Ta'lim",
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              key: '1',
              label: "Oliy ta'lim",
              children: (
                <Row gutter={[16, 16]}>
                  {renderField("Ta'lim darajasi", 'education', 'select', {
                    items: [
                      { value: 'Oliy', label: 'Oliy' },
                      { value: 'Magistr', label: 'Magistr' },
                      { value: 'Doktorantura', label: 'Doktorantura' },
                    ],
                  })}
                  {renderField('Tamomlagan muassasa', 'graduatedFrom')}
                  {renderField('Bitirgan yili', 'graduationYear')}
                  {renderField('Mutaxassislik', 'specialization')}
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Ilmiy daraja',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Ilmiy daraja', 'degree', 'select', {
                    items: [
                      { value: "Yo'q", label: "Yo'q" },
                      { value: 'Fan nomzodi', label: 'Fan nomzodi' },
                      { value: 'Fan doktori', label: 'Fan doktori' },
                      { value: 'PhD', label: 'PhD' },
                    ],
                  })}
                </Row>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: '3',
      label: 'Ish faoliyati',
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Asosiy',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Fakultet', 'faculty')}
                  {renderField('Kafedra', 'department')}
                  {renderField('Lavozim', 'position', 'select', {
                    items: [
                      { value: "O'qituvchi", label: "O'qituvchi" },
                      { value: "Katta o'qituvchi", label: "Katta o'qituvchi" },
                      { value: 'Dotsent', label: 'Dotsent' },
                      { value: 'Professor', label: 'Professor' },
                    ],
                  })}
                  {renderField('Ishga kirgan sana', 'workStartDate', 'date')}
                  {renderField('Ish tajribasi', 'experience')}
                  {renderField('Shartnoma raqami', 'contractNumber')}
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Moliyaviy',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Oylik maosh', 'salary', 'text', {
                    suffix: "so'm",
                  })}
                  {renderField('Bank hisob raqami', 'bankAccount')}
                </Row>
              ),
            },
            {
              key: '3',
              label: 'Yuklamalar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      O'qitiladigan fanlar
                    </label>
                    <Space wrap className="mb-4">
                      {teacher?.courses?.map((course, index) => (
                        <Tag color="blue" key={index}>
                          {course}
                        </Tag>
                      ))}
                    </Space>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: '4',
      label: 'Ilmiy faoliyat',
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Nashrlar',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Maqolalar soni', 'publications', 'number')}
                  {renderField(
                    'Asosiy maqolalar',
                    'publicationDetails',
                    'textarea',
                    { rows: 4 }
                  )}
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Loyihalar',
              children: (
                <Row gutter={[16, 16]}>
                  {renderField('Loyihalar soni', 'projects', 'number')}
                  {renderField(
                    'Loyihalar tavsifi',
                    'projectDetails',
                    'textarea',
                    { rows: 4 }
                  )}
                </Row>
              ),
            },
            {
              key: '3',
              label: 'Mukofotlar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Mukofotlar va unvonlar
                    </label>
                    <TextArea
                      value={teacher?.awards}
                      onChange={e =>
                        handleInputChange('awards', e.target.value)
                      }
                      disabled={!editMode}
                      rows={5}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      ),
    },
  ];

  if (loading || !teacher) {
    return (
      <div className="flex justify-center items-center h-screen">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2 sm:p-4 md:p-6">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left Side - Profile Info */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-center w-full md:w-auto">
              {/* Profile Image with Upload */}
              <div className="relative group flex-shrink-0">
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover border-2 sm:border-4 border-white shadow-lg rounded-full"
                  />
                ) : (
                  <Avatar
                    size={{ xs: 96, sm: 112, md: 128 }}
                    icon={<UserOutlined />}
                    className="border-2 sm:border-4 border-white shadow-lg"
                  />
                )}

                {editMode && (
                  <Upload {...imageUploadProps}>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <CameraOutlined className="text-white text-xl sm:text-2xl" />
                    </div>
                  </Upload>
                )}
              </div>

              {/* Teacher Info */}
              <div className="text-center md:text-left w-full md:w-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">
                  {teacher.firstName} {teacher.lastName}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  <Tag
                    color="gold"
                    className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1"
                  >
                    {teacher.position}
                  </Tag>
                  <Tag
                    color="green"
                    className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1"
                  >
                    {teacher.degree}
                  </Tag>
                </div>
                <div className="text-blue-100 text-sm sm:text-base space-y-1">
                  <p className="break-all">📧 {teacher.email}</p>
                  <p>📱 {teacher.phone}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="large"
                className="bg-white/20 hover:bg-white/30 border-white text-white w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Orqaga</span>
              </Button>
              {editMode ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  size="large"
                  loading={loading}
                  className="bg-green-500 hover:bg-green-600 border-none w-full sm:w-auto"
                >
                  Saqlash
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="large"
                  className="bg-white text-blue-600 hover:bg-blue-50 border-none w-full sm:w-auto"
                >
                  Tahrirlash
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow-lg rounded-xl sm:rounded-2xl">
        <Tabs
          defaultActiveKey="1"
          items={mainTabItems}
          size="large"
          className="teacher-detail-tabs"
        />
      </Card>
    </div>
  );
};

export default TeacherDetail;
