"use client"

import { Card, Tabs, Tag, Rate, Button, Descriptions } from "antd"
import {
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import StatisticsCards from "../../components/teacher/StatisticsCards"

const { TabPane } = Tabs

const TeacherDetail = () => {
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
              src="https://i.ibb.co/4ww2q7nY/asror.jpg"
              className="w-full h-[300px] object-cover rounded-xl"
            />
          }
        >
          <h2 className="text-[20px] font-semibold">Alisher Rahimov</h2>
          <p className="text-gray-500 mb-2">Mathematics</p>
          <Rate disabled defaultValue={5} />
          <p className="text-gray-500 mt-1">(127 baho)</p>

          <div className="text-left mt-4 leading-relaxed space-y-1">
            <p>
              <ClockCircleOutlined /> <b>Tajriba:</b> 10+ years
            </p>
            <p>
              <BookOutlined /> <b>Malakasi:</b> Master's Degree in Mathematics
            </p>
            <p>
              <TeamOutlined /> <b>O‘quvchilar:</b> 1,250+
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
                  <p className="text-gray-500 mb-5">
                    Experienced math teacher with 10+ years of teaching history.
                    Specialized in algebra, geometry, and calculus.
                  </p>

                  <Descriptions
                    bordered
                    column={2}
                    size="small"
                    styles={{ label: { fontWeight: 500 } }}
                  >
                    <Descriptions.Item label="Tillar">
                      O‘zbek, Rus, Ingliz
                    </Descriptions.Item>
                    <Descriptions.Item label="Soat narxi">
                      50,000 so‘m
                    </Descriptions.Item>
                    <Descriptions.Item label="Vaqti">
                      Har kuni 9:00–18:00
                    </Descriptions.Item>
                    <Descriptions.Item label="Dars shakli">
                      Online / Offline
                    </Descriptions.Item>
                  </Descriptions>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Bog‘lanish uchun</h4>
                    <p>
                      <MailOutlined /> alisher.rahimov@example.com
                    </p>
                    <p>
                      <EnvironmentOutlined /> Tashkent, O‘zbekiston
                    </p>
                  </div>
                </TabPane>

                <TabPane tab="Ko‘nikmalari" key="2">
                  <div className="flex flex-wrap gap-2">
                    <Tag color="blue">Algebra</Tag>
                    <Tag color="green">Geometry</Tag>
                    <Tag color="purple">Calculus</Tag>
                    <Tag color="orange">Trigonometry</Tag>
                  </div>
                </TabPane>

                <TabPane tab="Yutuqlari" key="3">
                  <p>2020 — "Yilning eng yaxshi o‘qituvchisi" mukofoti</p>
                  <p>2018 — Talabalar olimpiadasi murabbiyi sifatida 1-o‘rin</p>
                </TabPane>
              </Tabs>
            </TabPane>

            <TabPane tab="Kurslar" key="2">
              <p>Matematika asoslari (Boshlang‘ich)</p>
              <p>Algebra va tenglamalar</p>
              <p>Geometriya amaliyotlari</p>
            </TabPane>

            <TabPane tab="Tajriba" key="3">
              <p>Oliy ta’limda 10 yildan ortiq dars berish tajribasi.</p>
              <p>Online kurslar platformalarida 1,000+ o‘quvchi.</p>
            </TabPane>

            <TabPane tab="Sharhlar" key="4">
              <p>⭐️⭐️⭐️⭐️⭐️ — Ajoyib o‘qituvchi! Juda tushunarli tushuntiradi.</p>
              <p>⭐️⭐️⭐️⭐️ — Juda foydali darslar va yaxshi muomala.</p>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Statistikalar qismi */}
      <StatisticsCards />
    </>
  )
}

export default TeacherDetail
