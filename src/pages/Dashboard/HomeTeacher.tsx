import React, { useState, useEffect } from "react";
import { Card, Tabs, Button, Drawer, Form, Input, Spin } from "antd";
import { FilePdfOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Biography from "../../components/ui/Biography/Biography";
import { useProfile } from "../../hooks/useProfileOperations";
import { toast } from "sonner";

const { TabPane } = Tabs;

const HomeTeacher = () => {
  const { data: teacher, isLoading, isError, error } = useProfile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isError && error?.message) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi.</p>
    );
  }

  const openDrawer = () => {
    form.setFieldsValue(teacher);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const onSave = (values: any) => {
    // Shu yerda update API qo‘shish mumkin
    toast.success("Ma’lumotlar frontendda yangilandi (faqat frontend)");
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
              src={teacher.imageUrl || "/default-avatar.png"}
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

              <Button type="primary" block onClick={openDrawer}>Ma’lumotlarni tahrirlash</Button>

              {teacher.fileUrl && (
                <Button
                  type="default"
                  icon={<FilePdfOutlined />}
                  block
                  onClick={() => window.open(teacher.fileUrl, "_blank", "noopener,noreferrer")}
                >
                  PDFni ochish
                </Button>
              )}
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
              <Biography text={teacher.biography || "Ma’lumot yo‘q"} fallback="Ma’lumot yo‘q" />
            </Card>

            <Card className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-semibold mb-1">O‘qituvchi haqida</h3>
              <p className="text-gray-500 !m-0">{teacher.input || "Ma’lumot yo‘q"}</p>
            </Card>
          </div>

          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Tadqiqotlar" key="1">
              {(teacher.research?.length || 0) > 0
                ? teacher.research.map((item, i) => <Card key={i} className="p-4 mb-4">• {item}</Card>)
                : <Card className="p-4 mb-4">Ma’lumot yo‘q</Card>
              }
            </TabPane>
            <TabPane tab="Nazorat" key="2">
              {(teacher.nazorat?.length || 0) > 0
                ? teacher.nazorat.map((item, i) => <Card key={i} className="p-4 mb-4">• {item}</Card>)
                : <Card className="p-4 mb-4">Ma’lumot yo‘q</Card>
              }
            </TabPane>
            <TabPane tab="Nashrlar" key="3">
              {(teacher.publication?.length || 0) > 0
                ? teacher.publication.map((item, i) => <Card key={i} className="p-4 mb-4">• {item}</Card>)
                : <Card className="p-4 mb-4">Ma’lumot yo‘q</Card>
              }
            </TabPane>
            <TabPane tab="Mukofot/E'tirof" key="4">
              {(teacher.award?.length || 0) > 0
                ? teacher.award.map((item, i) => <Card key={i} className="p-4 mb-4">• {item}</Card>)
                : <Card className="p-4 mb-4">Ma’lumot yo‘q</Card>
              }
            </TabPane>
            <TabPane tab="Maslahat" key="5">
              {(teacher.consultation?.length || 0) > 0
                ? teacher.consultation.map((item, i) => <Card key={i} className="p-4 mb-4">• {item}</Card>)
                : <Card className="p-4 mb-4">Ma’lumot yo‘q</Card>
              }
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* 🔹 Drawer */}
      <Drawer title="O‘z ma’lumotlarini tahrirlash" placement="right" width={400} onClose={closeDrawer} open={drawerOpen}>
        <Form layout="vertical" form={form} onFinish={onSave} initialValues={teacher}>
          <Form.Item label="F.I.O" name="fullName"><Input /></Form.Item>
          <Form.Item label="Lavozim" name="lavozimName"><Input /></Form.Item>
          <Form.Item label="Kafedra" name="departmentName"><Input /></Form.Item>
          <Form.Item label="Telefon" name="phone"><Input /></Form.Item>
          <Form.Item label="Email" name="email"><Input /></Form.Item>
          <Form.Item label="Tavsif (biography)" name="biography"><Input.TextArea rows={4} /></Form.Item>
          <Form.Item label="Qo‘shimcha ma’lumot" name="input"><Input.TextArea rows={4} /></Form.Item>
          <Button type="primary" block htmlType="submit">Saqlash</Button>
        </Form>
      </Drawer>
    </>
  );
};

export default HomeTeacher;
