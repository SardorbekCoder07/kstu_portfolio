import React, { useState } from "react";
import { Card, Tabs, Button, Drawer, Form, Input } from "antd";
import {
  FilePdfOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import image from "../../assets/images/image.png";
import Biography from "../../components/ui/Biography/Biography";

const { TabPane } = Tabs;

const HomeTeacherStatic = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [teacher, setTeacher] = useState({
    fullName: "Temurbek Narzullayev",
    lavozimName: "Oliy matematika o‘qituvchisi",
    departmentName: "Matematika kafedrasi",
    biography:
      "10 yildan ortiq tajribaga ega, asosan algebra va analiz bo‘yicha dars beradi.",
    input:
      "O‘qituvchi sifatida zamonaviy metodlarni qo‘llaydi va talabalarni amaliyotga yo‘naltiradi.",
    phone: "+998 90 123 45 67",
    email: "temurbek@example.com",
    imageUrl: image,
    fileUrl: "https://example.com/sample.pdf",
  });

  const [form] = Form.useForm();

  const openDrawer = () => {
    form.setFieldsValue(teacher); // formga hozirgi ma’lumotlarni yuklaymiz
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const onSave = (values: any) => {
    setTeacher(prev => ({ ...prev, ...values }));
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-[1fr_2fr] items-start">
        {/* Chap panel */}
        <Card
          hoverable
          className="text-center rounded-xl"
          cover={
            <img
              alt="teacher"
              src={teacher.imageUrl}
              className="w-full h-[300px] object-cover rounded-xl"
            />
          }
        >
          <h2 className="text-[20px] font-semibold">{teacher.fullName}</h2>
          <p className="text-gray-500 mb-2">{teacher.lavozimName}</p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                <PhoneOutlined className="text-gray-600 text-[18px]" />
                <p className="text-gray-700 !m-0 font-medium">{teacher.phone}</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                <MailOutlined className="text-gray-600 text-[18px]" />
                <p className="text-gray-700 !m-0 font-medium">{teacher.email}</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                <IdcardOutlined className="text-gray-600 text-[18px]" />
                <p className="text-gray-700 !m-0 font-medium">{teacher.lavozimName}</p>
              </div>

              {/* 🔹 Edit button */}
              <Button type="primary" block onClick={openDrawer}>
                Ma’lumotlarni tahrirlash
              </Button>

              <Button
                type="default"
                icon={<FilePdfOutlined />}
                size="middle"
                block
                onClick={() =>
                  window.open(teacher.fileUrl, "_blank", "noopener,noreferrer")
                }
              >
                PDFni ochish
              </Button>
            </div>
          </div>
        </Card>

        {/* O‘ng panel */}
        <Card className="rounded-xl">
          <div className="flex flex-col gap-3 mb-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
              <ClockCircleOutlined className="text-gray-600 text-[18px]" />
              <p className="text-gray-700 !m-0 font-medium">
                <b>Kafedra:</b> {teacher.departmentName}
              </p>
            </div>

            <Card className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-semibold mb-1">Tadqiqotlar</h3>
              <Biography text={teacher.biography} fallback="Ma’lumot yo‘q" />
            </Card>

            <Card className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-semibold mb-1">O‘qituvchi haqida</h3>
              <p className="text-gray-500 !m-0">{teacher.input}</p>
            </Card>
          </div>

          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Tadqiqotlar" key="1">
              <Card className="p-4 mb-4">• Algebra bo‘yicha tadqiqotlar</Card>
              <Card className="p-4 mb-4">• Analiz bo‘yicha tadqiqotlar</Card>
            </TabPane>
            <TabPane tab="Nazorat" key="2">
              <Card className="p-4 mb-4">• Testlar va nazorat ishlari</Card>
              <Card className="p-4 mb-4">• Nazorat natijalari</Card>
            </TabPane>
            <TabPane tab="Nashrlar" key="3">
              <Card className="p-4 mb-4">• Kitoblar</Card>
              <Card className="p-4 mb-4">• Maqolalar</Card>
            </TabPane>
            <TabPane tab="Mukofot/E'tirof" key="4">
              <Card className="p-4 mb-4">• Oliy ta'lim mukofoti</Card>
              <Card className="p-4 mb-4">• Davlat e’tirofi</Card>
            </TabPane>
            <TabPane tab="Maslahat" key="5">
              <Card className="p-4 mb-4">• O‘quvchilarga maslahatlar</Card>
              <Card className="p-4 mb-4">• Metodik qo‘llanmalar</Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* 🔹 Drawer */}
      <Drawer
        title="O‘z ma’lumotlarini tahrirlash"
        placement="right"
        width={400}
        onClose={closeDrawer}
        open={drawerOpen}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onSave}
          initialValues={teacher}
        >
          <Form.Item label="F.I.O" name="fullName">
            <Input />
          </Form.Item>

          <Form.Item label="Lavozim" name="lavozimName">
            <Input />
          </Form.Item>

          <Form.Item label="Kafedra" name="departmentName">
            <Input />
          </Form.Item>

          <Form.Item label="Telefon" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Tavsif (biography)" name="biography">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Qo‘shimcha ma’lumot" name="input">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button type="primary" block htmlType="submit">
            Saqlash
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default HomeTeacherStatic;
