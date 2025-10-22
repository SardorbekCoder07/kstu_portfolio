// pages/teachers/AddTeachers.tsx
import { PageHeader } from '../../components/ui/PageHeader';
import { PlusOutlined } from '@ant-design/icons';
import { useDrawerStore } from '../../stores/useDrawerStore';
import { TeacherSidebar } from './TeacherSidebar';
import { useState } from 'react';
import { message, Card, Button, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface TeacherFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  position: string;
  degree: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  image?: string;
}

const AddTeachers = () => {
  const { openDrawer } = useDrawerStore();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Demo teachers data
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      firstName: 'Aziz',
      lastName: 'Karimov',
      image: undefined,
    },
    {
      id: '2',
      firstName: 'Dilnoza',
      lastName: 'Rahimova',
      image: undefined,
    },
    {
      id: '3',
      firstName: 'Bobur',
      lastName: 'Toshmatov',
      image: undefined,
    },
    {
      id: '4',
      firstName: 'Malika',
      lastName: 'Yusupova',
      image: undefined,
    },
  ]);

  const handleSubmit = async (values: TeacherFormValues) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("Ustoz muvaffaqiyatli qo'shildi!");
    } catch (error) {
      message.error('Xatolik yuz berdi!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    console.log('Searching for:', value);
  };

  // ✅ Batafsil sahifaga o'tish
  const handleViewDetails = (teacherId: string) => {
    navigate(`/teachers/${teacherId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={teachers.length}
        countLabel="O'qituvchilar soni"
        searchPlaceholder="O'qituvchilarni qidirish..."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        buttonText="Ustoz qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={openDrawer}
      />

      <TeacherSidebar
        onSubmit={handleSubmit}
        loading={loading}
        editMode={false}
      />

      {/* ✅ Teacher Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <Row gutter={[16, 16]}>
          {teachers.map(teacher => (
            <Col xs={24} sm={12} md={8} lg={6} key={teacher.id}>
              <Card
                hoverable
                className="text-center"
                cover={
                  <div className="flex justify-center items-center py-6 bg-gray-50">
                    <Avatar
                      size={80}
                      src={teacher.image}
                      icon={!teacher.image && <UserOutlined />}
                      className="bg-blue-500"
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <div className="text-lg font-semibold">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                  }
                  description={
                    <Button
                      type="primary"
                      block
                      onClick={() => handleViewDetails(teacher.id)}
                      className="mt-3"
                    >
                      Batafsil
                    </Button>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {teachers.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            O'qituvchilar topilmadi
          </p>
        )}
      </div>
    </div>
  );
};

export default AddTeachers;
