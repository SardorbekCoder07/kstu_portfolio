import { useParams } from "react-router-dom";
import { Card, Tabs, Spin, message } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Teacher } from "../../api/pagesApi/teacherApi";
import axiosClient from "../../api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import Biography from "../../components/ui/Biography/Biography";
import BackButton from "../../components/ui/BackButon/BackButton";
import Nazorat from "../../components/teacher/TabPanes/Control";
import Nashr from "../../components/teacher/TabPanes/Publication";
import Mukofot from "../../components/teacher/TabPanes/Award";
import Maslahat from "../../components/teacher/TabPanes/Advice";
import StatisticsCards from "../../components/teacher/StatisticsCards";
import ResearchList from "../../components/teacher/TabPanes/ResearchList";

const { TabPane } = Tabs;

const fetchTeacher = async (id: string): Promise<Teacher> => {
  const res = await axiosClient.get(`/user/${id}`);
  if (!res.data?.success)
    throw new Error("Ma’lumotni olishda xatolik yuz berdi");
  return res.data.data;
};

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: teacher,
    isLoading,
    isError,
    error,
  } = useQuery<Teacher, Error>({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeacher(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    message.error(error.message);
    return (
      <p className="text-center text-red-500 mt-10">
        Ma’lumotni yuklashda xatolik: {error.message}
      </p>
    );
  }

  if (!teacher) {
    return (
      <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi.</p>
    );
  }

  return (
    <>
      <div className="px-6">
        <BackButton />
      </div>

      <div className="mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-[1fr_2fr] items-start">
        {/* Chap panel */}
        <Card
          hoverable
          className="text-center rounded-xl"
          cover={
            <img
              alt="teacher"
              src={teacher.imageUrl || "../../../public/images/image.png"}
              className="w-full h-[300px] object-cover rounded-xl"
            />
          }
        >
          <h2 className="text-[20px] font-semibold">{teacher.fullName}</h2>
          <p className="text-gray-500 mb-2">{teacher.lavozimName || "—"}</p>

          <div className="text-left mt-4 leading-relaxed space-y-1">
            <p>
              <ClockCircleOutlined /> <b>Kafedra:</b>{" "}
              {teacher.departmentName || "Ma’lumot yo‘q"}
            </p>
            <Biography text={teacher.biography} fallback="Joylashuv yo‘q" />
          </div>

          <div className="text-left mt-4 leading-relaxed space-y-1">
            <h3 className="font-semibold !m-0">O‘qituvchi haqida</h3>
            <p className="text-gray-500 !m-0">{teacher.input}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
              <PhoneOutlined className="text-gray-600 text-[18px]" />
              <p className="text-gray-700 !m-0 font-medium">
                {teacher.phone || "—"}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
              <MailOutlined className="text-gray-600 text-[18px]" />
              <p className="text-gray-700 !m-0 font-medium">
                {teacher.email || "—"}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
              <IdcardOutlined className="text-gray-600 text-[18px]" />
              <p className="text-gray-700 !m-0 font-medium">
                {teacher.lavozimName || "—"}
              </p>
            </div>
          </div>
        </Card>

        {/* O‘ng panel */}
        <Card className="rounded-xl">
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Tadqiqotlar" key="1">
              <ResearchList />
            </TabPane>

            <TabPane tab="Nazorat" key="2">
              <Nazorat />
            </TabPane>

            <TabPane tab="Nashrlar" key="3">
              <Nashr />
            </TabPane>

            <TabPane tab="Mukofot/E'tirof" key="4">
              <Mukofot />
            </TabPane>

            <TabPane tab="Maslahat" key="5">
              <Maslahat />
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <StatisticsCards />
    </>
  );
};

export default TeacherDetail;
