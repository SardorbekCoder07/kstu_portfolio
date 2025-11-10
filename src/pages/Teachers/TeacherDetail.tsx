"use client";

import { useEffect, useState } from "react";
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

const { TabPane } = Tabs;

// ✅ API dan keladigan ma’lumotlar uchun interface
interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string;
  input: string;
  imageUrl: string;
  role: string;
  fileUrl: string | null;
  profession: string | null;
  lavozimName: string;
  departmentName: string;
  qualification: { body: any[] };
  research: { body: any[] };
  award: { body: any[] };
  consultation: { body: any[] };
  nazorat: { body: any[] };
  publication: { body: any[] };
}

const TeacherDetail = () => {
  const { id } = useParams(); // ✅ URL dan id ni olish
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // id URL dan olinadi, masalan: /teachers/10
        const res = await axiosClient.get(`/user/${id}`);
        if (res.data?.success) {
          setTeacher(res.data.data);
        } else {
          message.error("Ma'lumotni olishda xatolik yuz berdi");
        }
      } catch (err) {
        message.error("Server bilan bog‘lanishda xatolik");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!teacher) {
    return <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi.</p>;
  }

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
              src={teacher.imageUrl || "https://via.placeholder.com/300x300"}
              className="w-full h-[300px] object-cover rounded-xl"
            />
          }
        >
          <h2 className="text-[20px] font-semibold">{teacher.fullName}</h2>
          <p className="text-gray-500 mb-2">{teacher.lavozimName || "—"}</p>
          <Rate disabled defaultValue={5} />
          <p className="text-gray-500 mt-1">(127 baho)</p>

          <div className="text-left mt-4 leading-relaxed space-y-1">
            <p>
              <ClockCircleOutlined /> <b>Kafedra:</b>{" "}
              {teacher.departmentName || "Ma’lumot yo‘q"}
            </p>
            <p>
              <BookOutlined /> <b>Biografiya:</b> {teacher.biography || "—"}
            </p>
            <p>
              <TeamOutlined /> <b>Roli:</b> {teacher.role || "—"}
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

            <TabPane tab="Nashrlar" key="3">
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
