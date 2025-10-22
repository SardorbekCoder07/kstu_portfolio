// pages/teachers/TeacherDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Avatar,
  Tabs,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Space,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  // ✅ Demo teacher data
  const [teacher, setTeacher] = useState({
    id: id,
    firstName: 'Aziz',
    lastName: 'Karimov',
    email: 'aziz.karimov@example.com',
    phone: '+998 90 123 45 67',
    faculty: 'Kompyuter fanlari',
    department: 'Dasturiy injiniring',
    position: 'Dotsent',
    degree: 'Texnika fanlari nomzodi',
    image: undefined,
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
  });

  const handleBack = () => {
    navigate('/teachers');
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setEditMode(false);
    console.log('Saving teacher data:', teacher);
  };

  // ✅ Main Tabs Items
  const mainTabItems = [
    {
      key: '1',
      label: "Shaxsiy ma'lumotlar",
      children: (
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Asosiy',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Ism</label>
                    <Input
                      value={teacher.firstName}
                      onChange={e =>
                        setTeacher({ ...teacher, firstName: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Familiya</label>
                    <Input
                      value={teacher.lastName}
                      onChange={e =>
                        setTeacher({ ...teacher, lastName: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Email</label>
                    <Input
                      value={teacher.email}
                      onChange={e =>
                        setTeacher({ ...teacher, email: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                      type="email"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Telefon</label>
                    <Input
                      value={teacher.phone}
                      onChange={e =>
                        setTeacher({ ...teacher, phone: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Tug'ilgan sana
                    </label>
                    <Input
                      value={teacher.birthDate}
                      onChange={e =>
                        setTeacher({ ...teacher, birthDate: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                      type="date"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Millati</label>
                    <Input
                      value={teacher.nationality}
                      onChange={e =>
                        setTeacher({ ...teacher, nationality: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Passport',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Passport seriya raqami
                    </label>
                    <Input
                      value={teacher.passport}
                      onChange={e =>
                        setTeacher({ ...teacher, passport: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Fuqaroligi
                    </label>
                    <Input
                      value={teacher.nationality}
                      onChange={e =>
                        setTeacher({ ...teacher, nationality: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Yashash manzili
                    </label>
                    <TextArea
                      value={teacher.address}
                      onChange={e =>
                        setTeacher({ ...teacher, address: e.target.value })
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
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Oilaviy holati
                    </label>
                    <Select
                      value={teacher.maritalStatus}
                      onChange={value =>
                        setTeacher({ ...teacher, maritalStatus: value })
                      }
                      disabled={!editMode}
                      size="large"
                      className="w-full"
                    >
                      <Option value="Turmush qurmagan">Turmush qurmagan</Option>
                      <Option value="Turmush qurgan">Turmush qurgan</Option>
                      <Option value="Ajrashgan">Ajrashgan</Option>
                    </Select>
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Qo'shimcha ma'lumot
                    </label>
                    <TextArea
                      placeholder="Oila a'zolari haqida ma'lumot"
                      disabled={!editMode}
                      rows={4}
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
    {
      key: '2',
      label: "Ta'lim",
      children: (
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          items={[
            {
              key: '1',
              label: "Oliy ta'lim",
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Ta'lim darajasi
                    </label>
                    <Select
                      value={teacher.education}
                      onChange={value =>
                        setTeacher({ ...teacher, education: value })
                      }
                      disabled={!editMode}
                      size="large"
                      className="w-full"
                    >
                      <Option value="Oliy">Oliy</Option>
                      <Option value="Magistr">Magistr</Option>
                      <Option value="Doktorantura">Doktorantura</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Tamomlagan muassasa
                    </label>
                    <Input
                      value={teacher.graduatedFrom}
                      onChange={e =>
                        setTeacher({
                          ...teacher,
                          graduatedFrom: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Bitirgan yili
                    </label>
                    <Input
                      value={teacher.graduationYear}
                      onChange={e =>
                        setTeacher({
                          ...teacher,
                          graduationYear: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Mutaxassislik
                    </label>
                    <Input
                      value={teacher.specialization}
                      onChange={e =>
                        setTeacher({
                          ...teacher,
                          specialization: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Ilmiy daraja',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Ilmiy daraja
                    </label>
                    <Select
                      value={teacher.degree}
                      disabled={!editMode}
                      size="large"
                      className="w-full"
                    >
                      <Option value="Yo'q">Yo'q</Option>
                      <Option value="Fan nomzodi">Fan nomzodi</Option>
                      <Option value="Fan doktori">Fan doktori</Option>
                      <Option value="PhD">PhD</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Ilmiy unvon
                    </label>
                    <Select
                      disabled={!editMode}
                      size="large"
                      className="w-full"
                      placeholder="Tanlang"
                    >
                      <Option value="Yo'q">Yo'q</Option>
                      <Option value="Dotsent">Dotsent</Option>
                      <Option value="Professor">Professor</Option>
                    </Select>
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Dissertatsiya mavzusi
                    </label>
                    <TextArea
                      placeholder="Dissertatsiya mavzusi"
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
              label: "Qo'shimcha",
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Sertifikatlar
                    </label>
                    <TextArea
                      placeholder="Sertifikatlar ro'yxati"
                      disabled={!editMode}
                      rows={3}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Kurslar</label>
                    <TextArea
                      placeholder="O'tgan kurslar"
                      disabled={!editMode}
                      rows={3}
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
    {
      key: '3',
      label: 'Ish faoliyati',
      children: (
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Asosiy',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Fakultet</label>
                    <Input
                      value={teacher.faculty}
                      onChange={e =>
                        setTeacher({ ...teacher, faculty: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Kafedra</label>
                    <Input
                      value={teacher.department}
                      onChange={e =>
                        setTeacher({ ...teacher, department: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">Lavozim</label>
                    <Select
                      value={teacher.position}
                      onChange={value =>
                        setTeacher({ ...teacher, position: value })
                      }
                      disabled={!editMode}
                      size="large"
                      className="w-full"
                    >
                      <Option value="O'qituvchi">O'qituvchi</Option>
                      <Option value="Katta o'qituvchi">Katta o'qituvchi</Option>
                      <Option value="Dotsent">Dotsent</Option>
                      <Option value="Professor">Professor</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Ishga kirgan sana
                    </label>
                    <Input
                      value={teacher.workStartDate}
                      onChange={e =>
                        setTeacher({
                          ...teacher,
                          workStartDate: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      size="large"
                      type="date"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Ish tajribasi
                    </label>
                    <Input
                      value={teacher.experience}
                      onChange={e =>
                        setTeacher({ ...teacher, experience: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Shartnoma raqami
                    </label>
                    <Input
                      value={teacher.contractNumber}
                      onChange={e =>
                        setTeacher({
                          ...teacher,
                          contractNumber: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Moliyaviy',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Oylik maosh
                    </label>
                    <Input
                      value={teacher.salary}
                      onChange={e =>
                        setTeacher({ ...teacher, salary: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                      suffix="so'm"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Bank hisob raqami
                    </label>
                    <Input
                      value={teacher.bankAccount}
                      onChange={e =>
                        setTeacher({ ...teacher, bankAccount: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                    />
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Qo'shimcha to'lovlar
                    </label>
                    <TextArea
                      placeholder="Ustamalar, bonuslar"
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
              label: 'Yuklamalar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      O'qitiladigan fanlar
                    </label>
                    <Space wrap className="mb-4">
                      {teacher.courses.map((course, index) => (
                        <Tag color="blue" key={index}>
                          {course}
                        </Tag>
                      ))}
                    </Space>
                    <TextArea
                      placeholder="Yangi fan qo'shish"
                      disabled={!editMode}
                      rows={2}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Haftalik soat
                    </label>
                    <Input
                      placeholder="Masalan: 18"
                      disabled={!editMode}
                      size="large"
                      suffix="soat"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Guruhlar soni
                    </label>
                    <Input
                      placeholder="Masalan: 4"
                      disabled={!editMode}
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
    {
      key: '4',
      label: 'Ilmiy faoliyat',
      children: (
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          items={[
            {
              key: '1',
              label: 'Nashrlar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Maqolalar soni
                    </label>
                    <Input
                      value={teacher.publications}
                      onChange={e =>
                        setTeacher({ ...teacher, publications: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                      type="number"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Xalqaro nashrlar
                    </label>
                    <Input
                      placeholder="Soni"
                      disabled={!editMode}
                      size="large"
                      type="number"
                    />
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Asosiy maqolalar
                    </label>
                    <TextArea
                      placeholder="Muhim nashrlar ro'yxati"
                      disabled={!editMode}
                      rows={4}
                      size="large"
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Loyihalar',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Loyihalar soni
                    </label>
                    <Input
                      value={teacher.projects}
                      onChange={e =>
                        setTeacher({ ...teacher, projects: e.target.value })
                      }
                      disabled={!editMode}
                      size="large"
                      type="number"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="block mb-2 font-semibold">
                      Faol loyihalar
                    </label>
                    <Input
                      placeholder="Hozirda davom etayotgan"
                      disabled={!editMode}
                      size="large"
                      type="number"
                    />
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Loyihalar tavsifi
                    </label>
                    <TextArea
                      placeholder="Asosiy loyihalar haqida"
                      disabled={!editMode}
                      rows={4}
                      size="large"
                    />
                  </Col>
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
                      value={teacher.awards}
                      onChange={e =>
                        setTeacher({ ...teacher, awards: e.target.value })
                      }
                      disabled={!editMode}
                      rows={5}
                      size="large"
                    />
                  </Col>
                  <Col xs={24}>
                    <label className="block mb-2 font-semibold">
                      Xalqaro tanlov va mukofotlar
                    </label>
                    <TextArea
                      placeholder="Xalqaro darajadagi yutuqlar"
                      disabled={!editMode}
                      rows={4}
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ✅ Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Avatar
              size={120}
              src={teacher.image}
              icon={!teacher.image && <UserOutlined />}
              className="border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {teacher.firstName} {teacher.lastName}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag color="gold" className="text-base px-3 py-1">
                  {teacher.position}
                </Tag>
                <Tag color="green" className="text-base px-3 py-1">
                  {teacher.degree}
                </Tag>
              </div>
              <div className="text-blue-100">
                <p>📧 {teacher.email}</p>
                <p>📱 {teacher.phone}</p>
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-3">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              size="large"
              className="bg-white/20 hover:bg-white/30 border-white text-white"
            >
              Orqaga
            </Button>
            {editMode ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                size="large"
                className="bg-green-500 hover:bg-green-600 border-none"
              >
                Saqlash
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                size="large"
                className="bg-white text-blue-600 hover:bg-blue-50 border-none"
              >
                Tahrirlash
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Main Content Card */}
      <Card className="shadow-lg rounded-2xl">
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
