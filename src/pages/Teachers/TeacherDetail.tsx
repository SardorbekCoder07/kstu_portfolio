import { useParams } from "react-router-dom";
import {
  Card,
  Tabs,
  Tag,
  Rate,
  Button,
  Descriptions,
  Spin,
  message,
} from "antd";
import {
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import StatisticsCards from "../../components/teacher/StatisticsCards";
import axiosClient from "../../api/axiosClient";
import { Teacher } from "../../api/pagesApi/teacherApi";
import { useQuery } from "@tanstack/react-query";

const { TabPane } = Tabs;

// 🔹 Fetch funksiyasi
const fetchTeacher = async (id: string): Promise<Teacher> => {
  const res = await axiosClient.get(`/user/${id}`);
  if (!res.data?.success) throw new Error("Ma’lumotni olishda xatolik yuz berdi");
  return res.data.data;
};

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ TanStack Query yordamida cache qilish
  const {
    data: teacher,
    isLoading,
    isError,
    error,
  } = useQuery<Teacher, Error>({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeacher(id!),
    enabled: !!id, // id mavjud bo‘lsa so‘rov yuboriladi
    staleTime: 1000 * 60 * 5, // 5 daqiqa cacheda saqlanadi
    retry: 2, // xatolikda 2 marta qayta urinadi
  });

  // 🌀 Yuklanish holati
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  // ❌ Xatolik holati
  if (isError) {
    message.error(error.message);
    return (
      <p className="text-center text-red-500 mt-10">
        Ma’lumotni yuklashda xatolik: {error.message}
      </p>
    );
  }

  // ⚠️ Ma’lumot topilmasa
  if (!teacher) {
    return <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi.</p>;
  }

  // ✅ Asosiy UI
  return (
    <>
      <div
        className="
          max-w-[1200px] 
          mx-auto 
          p-6 
          grid 
          gap-6
          grid-cols-1
          md:grid-cols-[1fr_2fr]
          items-start
        "
      >
        {/* Chap panel */}
        <Card
          hoverable
          className="text-center rounded-xl"
          cover={
            <img
              alt="teacher"
              src={teacher.imageUrl || "../../../public/image.png"}
              className="w-full h-[300px] object-cover rounded-xl"
            />
          }
        >
          <h2 className="text-[20px] font-semibold">{teacher.fullName}</h2>
          <p className="text-gray-500 mb-2">{teacher.lavozimName || "—"}</p>
          <p className="text-gray-500 mt-1">(127 baho)</p>

          <div className="text-left mt-4 leading-relaxed space-y-1">
            <p>
              <ClockCircleOutlined /> <b>Kafedra:</b>{" "}
              {teacher.departmentName || "Ma’lumot yo‘q"}
            </p>
            <p>
              <BookOutlined /> <b>Biografiya:</b> {teacher.biography || "—"}
            </p>
          </div>

          <Button type="primary" block className="mt-5 rounded-md">
            Bog‘lanish
          </Button>
        </Card>

        {/* O‘ng panel */}
        <Card className="rounded-xl">
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Haqida" key="1">
              <Tabs defaultActiveKey="1" size="small">
                <TabPane tab="Umumiy" key="1">
                  <h3 className="font-semibold mb-2">O‘qituvchi haqida</h3>
                  <p className="text-gray-500 mb-5">{teacher.input}</p>

                  <Descriptions
                    bordered
                    column={2}
                    size="small"
                    styles={{ label: { fontWeight: 500 } }}
                  >
                    <Descriptions.Item label="Telefon">
                      {teacher.phone || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {teacher.email || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lavozimi">
                      {teacher.lavozimName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kafedra">
                      {teacher.departmentName || "—"}
                    </Descriptions.Item>
                  </Descriptions>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Bog‘lanish uchun</h4>
                    <p>
                      <MailOutlined /> {teacher.email || "Email mavjud emas"}
                    </p>
                    <p>
                      <EnvironmentOutlined /> {teacher.biography || "Joylashuv yo‘q"}
                    </p>
                  </div>
                </TabPane>

                <TabPane tab="Ko‘nikmalari" key="2">
                  <div className="flex flex-wrap gap-2">
                    <Tag color="blue">{teacher.lavozimName || "Dotsent"}</Tag>
                    <Tag color="green">{teacher.role || "ROLE_TEACHER"}</Tag>
                    <Tag color="purple">Universitet o‘qituvchisi</Tag>
                  </div>
                </TabPane>

                <TabPane tab="Yutuqlari" key="3">
                  {teacher.award?.body?.length > 0 ? (
                    teacher.award.body.map((item: any, i: number) => (
                      <p key={i}>{item.title}</p>
                    ))
                  ) : (
                    <p>Hozircha yutuqlar mavjud emas.</p>
                  )}
                </TabPane>
              </Tabs>
            </TabPane>

            <TabPane tab="Tadqiqotlar" key="2">
              {teacher.research?.body?.length > 0 ? (
                teacher.research.body.map((item: any, i: number) => (
                  <p key={i}>{item.title}</p>
                ))
              ) : (
                <p>Hozircha tadqiqotlar mavjud emas.</p>
              )}
            </TabPane>

            <TabPane tab="Nazorat" key="3">
              {teacher.research?.body?.length > 0 ? (
                teacher.research.body.map((item: any, i: number) => (
                  <p key={i}>{item.title}</p>
                ))
              ) : (
                <p>Hozircha tadqiqotlar mavjud emas.</p>
              )}
            </TabPane>

            <TabPane tab="Nashrlar" key="4">
              {teacher.publication?.body?.length > 0 ? (
                teacher.publication.body.map((pub: any, i: number) => (
                  <p key={i}>{pub.title}</p>
                ))
              ) : (
                <p>Hozircha nashrlar mavjud emas.</p>
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Statistikalar */}
      <StatisticsCards />
    </>
  );
};

export default TeacherDetail;
