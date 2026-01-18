import React, { useState } from "react";
import { Card, Tabs, Button, Spin, Pagination, Tag, Empty } from "antd";
import {
  FilePdfOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import axiosClient from "../../api/axiosClient";
import { useProfile } from "../../hooks/useProfileOperations";
import { useDrawerStore } from "../../stores/useDrawerStore";

// Hooks
import { useResearchOperations } from "../../hooks/useResearchOperation";
import { usePublicationOperations } from "../../hooks/usePublicationOperation";
import { useAwardOperations } from "../../hooks/useAwardOperation";
import { useControlOperations } from "../../hooks/useControlOperation";
import { useAdviceOperations } from "../../hooks/useAdviceOperation";

// Sidebar
import { TeacherSidebar } from "../Teachers/TeacherSidebar";

const { TabPane } = Tabs;

const HomeTeacher: React.FC = () => {
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawerStore();

  const pageSize = 5;

  const [researchPage, setResearchPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);
  const [awardPage, setAwardPage] = useState(1);
  const [nazoratPage, setNazoratPage] = useState(1);
  const [advicePage, setAdvicePage] = useState(1);

  const { data: teacher, isLoading: profileLoading } = useProfile();

  // ================== DATA ==================
  const {
    researches,
    total: researchTotal,
    isResearchLoading,
  } = useResearchOperations(teacher?.id, researchPage - 1, pageSize);

  const {
    publications,
    total: publicationTotal,
    isPublicationLoading,
  } = usePublicationOperations(teacher?.id, publicationPage - 1, pageSize);

  const {
    awards,
    total: awardTotal,
    isAwardLoading,
  } = useAwardOperations(teacher?.id, awardPage - 1, pageSize);

  const {
    controles,
    total: nazoratTotal,
    isControlLoading,
  } = useControlOperations(teacher?.id, nazoratPage - 1, pageSize);

  const {
    advices,
    total: adviceTotal,
    isAdviceLoading,
  } = useAdviceOperations(teacher?.id, advicePage - 1, pageSize);

  // ================== UPDATE ==================
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosClient.put("/user", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ma’lumotlar muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Saqlashda xatolik yuz berdi");
    },
  });

  // ================== UPLOAD ==================
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosClient.post("/upload/image", formData);
      return res.data.url;
    },
  });

  const uploadPDFMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosClient.post("/upload/file", formData);
      return res.data.url;
    },
  });

  // ================== LOADING ==================
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!teacher) {
    return <p className="text-center text-red-500 mt-10">Ma’lumot topilmadi</p>;
  }

  return (
    <>
       <div className="mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-[1fr_2fr] items-start">
        {/* Chap taraf – Profil kartasi */}
        <Card
          hoverable
          className="text-center rounded-xl shadow-lg"
          cover={
            <img
              alt="teacher"
              src={teacher.imageUrl || "/default-avatar.png"}
              className="w-full h-[300px] object-cover rounded-t-xl"
            />
          }
        >
          <h2 className="text-2xl font-bold">{teacher.fullName}</h2>
          <p className="text-gray-600 mb-4">{teacher.lavozimName}</p>
          <p>{teacher.departmentName}</p>
          <p>
            <b>O'qituvchi haqida: </b>
            {teacher.input || "Ma’lumot yo‘q"}
          </p>
          <p>
            <b></b>
          </p>
          <div className="space-y-3 text-left">
            <div className="w-full py-2 px-4 rounded-xl flex gap-2 items-center bg-[#F9FAFB] border border- border-[#d9d9d9]">
              <PhoneOutlined />
              {teacher.phone}
            </div>
            <div className="w-full py-2 px-4 rounded-xl flex gap-2 items-center bg-[#F9FAFB] border border- border-[#d9d9d9]">
              <MailOutlined />
              {teacher.email}
            </div>
            <div className="w-full py-2 px-4 rounded-xl flex gap-2 items-center bg-[#F9FAFB] border border- border-[#d9d9d9]">
              <IdcardOutlined />
              {teacher.lavozimName}
            </div>

            <Button type="primary" block onClick={openDrawer}>
              Ma’lumotlarni tahrirlash
            </Button>

            <div className="my-3">
              {teacher.fileUrl && (
                <Button
                  icon={<FilePdfOutlined />}
                  block
                  onClick={() =>
                    window.open(
                      teacher.fileUrl,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  PDFni ochish
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* O'ng taraf – Tabs va ma'lumotlar */}
        <Card className="rounded-xl shadow-lg">
          <Tabs type="card" className="mt-6">
            <TabPane tab="Tadqiqotlar" key="1">
              {isResearchLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" tip="Yuklanmoqda..." />
                </div>
              ) : researches?.length ? (
                <ResearchList items={researches} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Hozircha tadqiqot ma'lumotlari mavjud emas"
                  className="py-16 text-gray-600"
                />
              )}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={researchPage}
                  pageSize={pageSize}
                  total={researchTotal}
                  onChange={setResearchPage}
                  showSizeChanger={false}
                  className="bg-white rounded-lg shadow-sm px-6 py-3"
                />
              </div>
            </TabPane>

            <TabPane tab="Nazorat" key="2">
              {isControlLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" tip="Yuklanmoqda..." />
                </div>
              ) : controles?.length ? (
                <NazoratList items={controles} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Hozircha nazorat ma'lumotlari mavjud emas"
                  className="py-16 text-gray-600"
                />
              )}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={nazoratPage}
                  pageSize={pageSize}
                  total={nazoratTotal}
                  onChange={setNazoratPage}
                  showSizeChanger={false}
                  className="bg-white rounded-lg shadow-sm px-6 py-3"
                />
              </div>
            </TabPane>

            <TabPane tab="Nashrlar" key="3">
              {isPublicationLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" tip="Yuklanmoqda..." />
                </div>
              ) : publications?.length ? (
                <PublicationList items={publications} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Hozircha nashrlar mavjud emas"
                  className="py-16 text-gray-600"
                />
              )}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={publicationPage}
                  pageSize={pageSize}
                  total={publicationTotal}
                  onChange={setPublicationPage}
                  showSizeChanger={false}
                  className="bg-white rounded-lg shadow-sm px-6 py-3"
                />
              </div>
            </TabPane>

            <TabPane tab="Mukofot" key="4">
              {isAwardLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" tip="Yuklanmoqda..." />
                </div>
              ) : awards?.length ? (
                <AwardList items={awards} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Hozircha mukofotlar mavjud emas"
                  className="py-16 text-gray-600"
                />
              )}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={awardPage}
                  pageSize={pageSize}
                  total={awardTotal}
                  onChange={setAwardPage}
                  showSizeChanger={false}
                  className="bg-white rounded-lg shadow-sm px-6 py-3"
                />
              </div>
            </TabPane>

            <TabPane tab="Maslahat" key="5">
              {isAdviceLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" tip="Yuklanmoqda..." />
                </div>
              ) : advices?.length ? (
                <AdviceList items={advices} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Hozircha maslahatlar mavjud emas"
                  className="py-16 text-gray-600"
                />
              )}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={advicePage}
                  pageSize={pageSize}
                  total={adviceTotal}
                  onChange={setAdvicePage}
                  showSizeChanger={false}
                  className="bg-white rounded-lg shadow-sm px-6 py-3"
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* ================= SIDEBAR ================= */}
      <TeacherSidebar
        editMode
        initialValues={{
          id: teacher.id,
          fullName: teacher.fullName,
          phoneNumber: teacher.phone,
          email: teacher.email,
          biography: teacher.biography,
          input: teacher.input,
          age: teacher.age,
          gender: teacher.gender,
          imgUrl: teacher.imageUrl,
          fileUrl: teacher.fileUrl,
          profession: teacher.profession,
          lavozmId: teacher.lavozmId,
          departmentId: teacher.departmentId,
        }}
        departmentList={[]}
        positionList={[]}
        createMutation={updateMutation}
        updateMutation={updateMutation}
        uploadImageMutation={uploadImageMutation}
        uploadPDFMutation={uploadPDFMutation}
      />
    </>
  );
};

export default HomeTeacher;

/* ================= Reusable Components ================= */
const Info = ({
  icon,
  text,
  value,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
  value?: string;
}) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 border rounded-xl mb-4 shadow-sm">
    <div className="text-xl text-blue-600">{icon}</div>
    <div>
      <p className="text-gray-700 font-medium">
        {text} <span className="font-semibold">{value || ""}</span>
      </p>
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
    <h3 className="font-bold text-lg mb-3 text-gray-800">{title}</h3>
    <div className="text-gray-700">{children}</div>
  </Card>
);

/* ================= Chiroyli Tab ichidagi List komponentlari ================= */
const ResearchList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/20"
      >
        <div className="p-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
              {item.name}
            </h4>
            <Tag
              color={item.finished ? "success" : "processing"}
              className="text-sm px-4 py-1 rounded-full font-medium"
            >
              {item.finished ? "Tugatilgan" : "Jarayonda"}
            </Tag>
          </div>

          <p className="text-gray-600 mb-5 line-clamp-3">
            {item.description || "Tavsif kiritilmagan"}
          </p>

          <div className="grid grid-cols-6 gap-4 text-sm mb-6">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Yil</div>
              <div className="font-semibold text-gray-800">{item.year}</div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Oliygoh</div>
              <div className="font-semibold text-gray-800">
                {item.univerName || "—"}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Daraja</div>
              <div className="font-semibold text-gray-800">
                {item.memberEnum || "—"}
              </div>
            </div>
          </div>
          {item.fileUrl && (
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              href={item.fileUrl}
              target="_blank"
              block
              size="large"
              className="h-11 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              PDF faylni ochish
            </Button>
          )}
        </div>
      </Card>

    ))}
  </div>
);

const NazoratList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/20"
      >
        <div className="p-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {item.name}
            </h4>
            <Tag
              color={item.finished ? "success" : "processing"}
              className="text-sm px-4 py-1 rounded-full font-medium"
            >
              {item.finished ? "Tugatilgan" : "Jarayonda"}
            </Tag>
          </div>

          <p className="text-gray-600 mb-5 line-clamp-3">
            {item.description || "Tavsif kiritilmagan"}
          </p>

          <div className="grid grid-cols-6 gap-4 text-sm mb-6">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Yil</div>
              <div className="font-semibold text-gray-800">{item.year}</div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Oliygoh</div>
              <div className="font-semibold text-gray-800">
                {item.univerName || "—"}
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">
                Tadqiqotchi
              </div>
              <div className="font-semibold text-gray-800">
                {item.researcherName || "—"}
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Daraja</div>
              <div className="font-semibold text-gray-800">
                {item.memberEnum || "—"}
              </div>
            </div>
          </div>

          {item.fileUrl && (
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              href={item.fileUrl}
              target="_blank"
              block
              size="large"
              className="h-11 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              PDF faylni ochish
            </Button>
          )}
        </div>
      </Card>
    ))}
  </div>
);

const PublicationList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/20"
      >
        <div className="p-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
              {item.name}
            </h4>
            <Tag
              color="blue"
              className="text-sm px-4 py-1 rounded-full font-medium"
            >
              {item.type || "Nashr"}
            </Tag>
          </div>

          <p className="text-gray-600 mb-5 line-clamp-3">
            {item.description || "Tavsif kiritilmagan"}
          </p>

          <div className="grid grid-cols-4 gap-4 text-sm mb-6">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Yil</div>
              <div className="font-semibold text-gray-800">{item.year}</div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">
                Mualliflik
              </div>
              <div className="font-semibold text-gray-800">
                {item.author || "—"}
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Daraja</div>
              <div className="font-semibold text-gray-800">
                {item.degree || "—"}
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Mashhur</div>
              <div className="font-semibold text-gray-800">
                {item.popular ? "Ha" : "Yo‘q"}
              </div>
            </div>
          </div>

          {item.fileUrl && (
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              href={item.fileUrl}
              target="_blank"
              block
              size="large"
              className="h-11 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              PDF faylni ochish
            </Button>
          )}
        </div>
      </Card>
    ))}
  </div>
);

const AwardList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50/30"
      >
        <div className="p-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
              {item.name}
            </h4>
            <Tag
              color="gold"
              className="text-sm px-4 py-1 rounded-full font-medium"
            >
              {item.awardEnum || "—"}
            </Tag>
          </div>

          <p className="text-gray-600 mb-5 line-clamp-3">
            {item.description || "Tavsif kiritilmagan"}
          </p>

          <div className="grid grid-cols-3 gap-4 text-sm mb-6">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Yil</div>
              <div className="font-semibold text-gray-800">{item.year}</div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Turi</div>
              <div className="font-semibold text-gray-800">
                {item.awardEnum || "—"}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Daraja</div>
              <div className="font-semibold text-gray-800">
                {item.memberEnum || "—"}
              </div>
            </div>
          </div>

          {item.fileUrl && (
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              href={item.fileUrl}
              target="_blank"
              block
              size="large"
              className="h-11 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              PDF faylni ochish
            </Button>
          )}
        </div>
      </Card>
    ))}
  </div>
);

const AdviceList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30"
      >
        <div className="p-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
              {item.name}
            </h4>
            <Tag
              color={
                item.finishedEnum === "Tugatilgan" ? "success" : "processing"
              }
              className="text-sm px-4 py-1 rounded-full font-medium"
            >
              {item.finishedEnum || "—"}
            </Tag>
          </div>

          <p className="text-gray-600 mb-5 line-clamp-3">
            {item.description || "Tavsif kiritilmagan"}
          </p>

          <div className="grid grid-cols-4 gap-4 text-sm mb-6">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Yil</div>
              <div className="font-semibold text-gray-800">{item.year}</div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Rahbar</div>
              <div className="font-semibold text-gray-800">
                {item.leader || "—"}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">Holati</div>
              <div className="font-semibold text-gray-800">
                {item.finishedEnum || "—"}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg shadow-sm">
              <div className="text-gray-500 text-xs font-medium">A'zolik</div>
              <div className="font-semibold text-gray-800">
                {item.member ? "Ha" : "Yo‘q"}
              </div>
            </div>
          </div>

          {item.fileUrl && (
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              href={item.fileUrl}
              target="_blank"
              block
              size="large"
              className="h-11 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              PDF faylni ochish
            </Button>
          )}
        </div>
      </Card>
    ))}
  </div>
);
