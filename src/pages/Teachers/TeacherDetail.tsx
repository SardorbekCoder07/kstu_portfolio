import { useParams } from "react-router-dom";
import {
  Card,
  Tabs,
  Tag,
  Button,
  Descriptions,
  Spin,
  message,
} from "antd";
import {
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import StatisticsCards from "../../components/teacher/StatisticsCards";
import axiosClient from "../../api/axiosClient";
import { Teacher } from "../../api/pagesApi/teacherApi";
import { useQuery } from "@tanstack/react-query";
import Biography from "../../components/ui/Biography/Biography";
import BackButton from "../../components/ui/BackButon/BackButton";

const { TabPane } = Tabs;

// 🔹 Fetch funksiyasi
const fetchTeacher = async (id: string): Promise<Teacher> => {
  const res = await axiosClient.get(`/user/${id}`);
  if (!res.data?.success)
    throw new Error("Ma’lumotni olishda xatolik yuz berdi");
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
    return (
      <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi.</p>
    );
  }

  // ✅ Asosiy UI
  return (
    <>
      <div className=" px-6">
        <BackButton />
      </div>
      <div
        className="
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
              src={teacher.imageUrl || "/public/images/image.png"}
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
              <p>
                <Biography text={teacher.biography} fallback="Joylashuv yo‘q" />
              </p>
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
                      <EnvironmentOutlined />{" "}
                      {teacher.biography || "Joylashuv yo‘q"}
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
              <div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-black text-lg font-semibold bg-pink-100 rounded-full">
                    1
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-800 font-medium text-sm !m-0">
                      UNESCOning "HANDONG UNITVIN" nomli xalqaro loyihasi
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        2024
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        A'zo
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        Xalqaro
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        HANDONG UNITVIN
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                        tugallandi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-md bg-blue-200 px-5 py-1.5 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-[12px] font-medium">PDF FAYLI</span>
                </div>
              </div>
              {/* {teacher.research?.body?.length > 0 ? (
                teacher.research.body.map((item: any, i: number) => (
                  <p key={i}>{item.title}</p>
                ))
              ) : (
                <p>Hozircha tadqiqotlar mavjud emas.</p>
              )} */}
            </TabPane>

            <TabPane tab="Nazorat" key="3">
              <div className="flex items-start justify-between w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Chap qism: Raqam + Matn + Taglar */}
                <div className="flex items-start gap-3">
                  {/* Raqam doirasi */}
                  <div className="flex items-center justify-center w-8 h-8 text-black text-sm font-bold bg-purple-100 rounded-full">
                    1
                  </div>

                  {/* Matn va taglar */}
                  <div className="flex flex-col gap-1">
                    {/* Sarlavha */}
                    <p className="text-gray-800 !m-0 font-semibold text-sm leading-tight">
                      Aziziddin Nasafiy “Insoni komil” asarining falsafiy
                      tahlili
                    </p>

                    {/* Muallif */}
                    <p className="text-gray-600 !m-0 text-xs">
                      Tadqiqotchi:{" "}
                      <span className="font-medium">
                        Xasanova Shoxida Sadriddinovna
                      </span>
                    </p>

                    {/* Universitet */}
                    <p className="text-gray-500 !m-0 text-xs italic">
                      Universitet:{" "}
                      <span className="font-medium">
                        Andijon davlat universiteti
                      </span>
                    </p>

                    {/* Taglar */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        2025
                      </span>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Usta
                      </span>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        Milliy
                      </span>
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        Nazoratchi
                      </span>
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                        Tugallandi
                      </span>
                    </div>
                  </div>
                </div>

                {/* O‘ng qism: PDF yuklash */}
                <div className="flex items-center gap-2 rounded-md bg-blue-200 px-5 py-1.5 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-[12px] font-medium">PDF FAYLI</span>
                </div>
              </div>
              {/* {teacher.research?.body?.length > 0 ? (
                teacher.research.body.map((item: any, i: number) => (
                  <p key={i}>{item.title}</p>
                ))
              ) : (
                <p>Hozircha nazorat mavjud emas.</p>
              )} */}
            </TabPane>

            <TabPane tab="Nashrlar" key="4">
              <div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Chap qism: Raqam + Sarlavha + Taglar */}
                <div className="flex items-center gap-3">
                  {/* Raqam doirasi */}
                  <div className="flex items-center justify-center w-8 h-8 text-black text-sm font-bold bg-blue-100 rounded-full">
                    1
                  </div>

                  {/* Matn va taglar */}
                  <div className="flex flex-col gap-1.5">
                    {/* Sarlavha */}
                    <h3 className="text-gray-900 !m-0 font-semibold text-sm leading-tight">
                      Uilyam Djems ijodida haqiqiy muammo yechimi
                    </h3>

                    {/* Qisqa izoh */}
                    <p className="text-gray-600 !m-0 text-xs">
                      "ISTF" ilmiy-uslubiy jurnal maxsus soni.
                    </p>

                    {/* Taglar */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        2025
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        Faqat birinchi muallif
                      </span>
                    </div>
                  </div>
                </div>

                {/* O‘ng qism: PDF yuklash */}
                <div className="flex items-center gap-2 rounded-md bg-blue-200 px-5 py-1.5 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-[12px] font-medium">PDF FAYLI</span>
                </div>
              </div>
              {/* {teacher.publication?.body?.length > 0 ? (
                teacher.publication.body.map((pub: any, i: number) => (
                  <p key={i}>{pub.title}</p>
                ))
              ) : (
                <p>Hozircha nashrlar mavjud emas.</p>
              )} */}
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
