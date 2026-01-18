import React, { useState } from "react";
import { Card, Tabs, Button, Spin, Tag } from "antd";
import {
  FilePdfOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { useProfileOperations } from "../../hooks/useProfileOperations";
import { useDrawerStore } from "../../stores/useDrawerStore";

// Hooks
import { useResearchOperations } from "../../hooks/useResearchOperation";
import { usePublicationOperations } from "../../hooks/usePublicationOperation";
import { useAwardOperations } from "../../hooks/useAwardOperation";
import { useControlOperations } from "../../hooks/useControlOperation";
import { useAdviceOperations } from "../../hooks/useAdviceOperation";

// Sidebar
import { TeacherSidebar } from "../Teachers/TeacherSidebar";
import { usePositionOperations } from "../../hooks/usePositionOperation";
import { useDepartmentOperations } from "../../hooks/useDepartmentOperation";
import { TabContent } from "../../components/common/TabContent";
import { FinishedEnum } from "../../api/pagesApi/adviceApi";

const { TabPane } = Tabs;

const HomeTeacher: React.FC = () => {
  const { openDrawer } = useDrawerStore();
  const { positions } = usePositionOperations();
  const { allDepartments } = useDepartmentOperations();

  const pageSize = 5;

  const [researchPage, setResearchPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);
  const [awardPage, setAwardPage] = useState(1);
  const [nazoratPage, setNazoratPage] = useState(1);
  const [advicePage, setAdvicePage] = useState(1);

  // ================= PROFILE =================
  const {
    profile: teacher,
    isProfileLoading,
    updateProfileMutation,
    uploadImageMutation,
    uploadPDFMutation,
  } = useProfileOperations();

  // ================= DATA =================
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

  // ================= LOADING =================
  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <p className="text-center text-red-500 mt-10">
        Profil ma’lumotlari topilmadi
      </p>
    );
  }

  return (
    <>
      <div className="mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-[1fr_2fr]">
        {/* ================= LEFT ================= */}
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

        {/* ================= RIGHT ================= */}
        <Card className="rounded-xl shadow-lg">
          <Tabs type="card">
            <TabPane tab="Tadqiqotlar" key="1">
              <TabContent
                loading={isResearchLoading}
                data={researches}
                total={researchTotal}
                page={researchPage}
                setPage={setResearchPage}
                render={(items) => <ResearchList items={items} />}
              />
            </TabPane>

            <TabPane tab="Nazorat" key="2">
              <TabContent
                loading={isControlLoading}
                data={controles}
                total={nazoratTotal}
                page={nazoratPage}
                setPage={setNazoratPage}
                render={(items) => <NazoratList items={items} />}
              />
            </TabPane>

            <TabPane tab="Nashrlar" key="3">
              <TabContent
                loading={isPublicationLoading}
                data={publications}
                total={publicationTotal}
                page={publicationPage}
                setPage={setPublicationPage}
                render={(items) => <PublicationList items={items} />}
              />
            </TabPane>

            <TabPane tab="Mukofotlar" key="4">
              <TabContent
                loading={isAwardLoading}
                data={awards}
                total={awardTotal}
                page={awardPage}
                setPage={setAwardPage}
                render={(items) => <AwardList items={items} />}
              />
            </TabPane>

            <TabPane tab="Maslahatlar" key="5">
              <TabContent
                loading={isAdviceLoading}
                data={advices}
                total={adviceTotal}
                page={advicePage}
                setPage={setAdvicePage}
                render={(items) => <AdviceList items={items} />}
              />
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
          biography: teacher.biography ?? undefined,
          input: teacher.input ?? undefined,
          age: teacher.age,
          gender: teacher.gender,
          imgUrl: teacher.imageUrl ?? undefined,
          fileUrl: teacher.fileUrl ?? undefined,
          profession: teacher.profession ?? undefined,
          lavozmId: teacher.lavozmId,
          departmentId: teacher.departmentId,
        }}
        departmentList={allDepartments}
        positionList={positions}
        createMutation={updateProfileMutation}
        updateMutation={updateProfileMutation}
        uploadImageMutation={uploadImageMutation}
        uploadPDFMutation={uploadPDFMutation}
      />
    </>
  );
};

export default HomeTeacher;

const ResearchList = ({ items = [] }: { items: any[] }) => (
  <div className="grid gap-6 md:grid-cols-1">
    {items.map((item) => (
      <Card
        key={item.id}
        hoverable
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/20"
      >
        <div className="p-1">
          <div className="flex items-start gap-4 flex-1 pr-4">
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
              {1}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.name}
              </p>
              <div>
                <p className="text-gray-600 text-xs !m-0">
                  {item.description || "Tavsif kiritilmagan"}
                </p>
                {/* {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                  >
                    {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                  </button>
                )} */}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {item.member ? "A'zo" : "A'zo emas"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {item.memberEnum}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.univerName}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.univerName}
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-medium ${
                    item.finished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.finished ? "Tugallangan" : "Jarayonda"}
                </span>
              </div>
            </div>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
              >
                <DownloadOutlined className="text-lg" />
                <span className="text-[13px] font-medium">PDF Fayli</span>
              </a>
            )}
          </div>
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
          <div className="flex items-start gap-4 flex-1 pr-4">
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
              {1}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.name}
              </p>
              <div>
                <p className="text-gray-600 text-xs !m-0">
                  {item.description || "Tavsif kiritilmagan"}
                </p>
                {/* {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                  >
                    {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                  </button>
                )} */}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {item.member ? "A'zo" : "A'zo emas"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {item.memberEnum}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.univerName}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.univerName}
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-medium ${
                    item.finished
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.finished ? "Tugallangan" : "Jarayonda"}
                </span>
              </div>
            </div>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
              >
                <DownloadOutlined className="text-lg" />
                <span className="text-[13px] font-medium">PDF Fayli</span>
              </a>
            )}
          </div>
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
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/20"
      >
        <div className="p-1">
          <div className="flex items-start gap-4 flex-1 pr-4">
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
              {1}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.name}
              </p>
              <div>
                <p className="text-gray-600 text-xs !m-0">
                  {item.description || "Tavsif kiritilmagan"}
                </p>
                {/* {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                  >
                    {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                  </button>
                )} */}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {item.type}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {item.author}
                </span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                  {item.degree}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.institution}
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-medium ${
                    item.popular
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.popular ? "Popular" : "Oddiy"}
                </span>
              </div>
            </div>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
              >
                <DownloadOutlined className="text-lg" />
                <span className="text-[13px] font-medium">PDF Fayli</span>
              </a>
            )}
          </div>
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
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/20"
      >
        <div className="p-1">
          <div className="flex items-start gap-4 flex-1 pr-4">
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
              {1}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.name}
              </p>
              <div>
                <p className="text-gray-600 text-xs !m-0">
                  {item.description || "Tavsif kiritilmagan"}
                </p>
                {/* {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                  >
                    {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                  </button>
                )} */}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                    {item.year}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {item.awardEnum === "Trening_Va_Amaliyot"
                      ? "Traning va amaliyot"
                      : item.awardEnum}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {item.memberEnum}
                  </span>
                </div>
              </div>
            </div>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
              >
                <DownloadOutlined className="text-lg" />
                <span className="text-[13px] font-medium">PDF Fayli</span>
              </a>
            )}
          </div>
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
        className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/20"
      >
        <div className="p-1">
          <div className="flex items-start gap-4 flex-1 pr-4">
            <div className="flex items-center justify-center w-10 h-10 text-white text-sm font-bold bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow">
              {1}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm leading-tight !m-0">
                {item.name}
              </p>
              <div>
                <p className="text-gray-600 text-xs !m-0">
                  {item.description || "Tavsif kiritilmagan"}
                </p>
                {/* {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs mt-1 transition-colors"
                  >
                    {isExpanded ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                  </button>
                )} */}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {item.member ? "A'zo" : "A'zo emas"}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {item.leader}
                </span>

                {/* Holat — to‘g‘ri enum qiymatlari bilan */}
                <span
                  className={`px-3 py-1 rounded-full font-medium text-xs ${
                    item.finishedEnum === FinishedEnum.COMPLETED ||
                    item.finishedEnum === FinishedEnum.FINISHED
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.finishedEnum === FinishedEnum.COMPLETED &&
                    "Tugallangan"}
                  {item.finishedEnum === FinishedEnum.FINISHED && "Yakunlangan"}
                  {item.finishedEnum === FinishedEnum.IN_PROGRESS &&
                    "Jarayonda"}
                </span>
              </div>
            </div>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition border border-blue-200 shadow-sm hover:shadow select-none flex-shrink-0"
              >
                <DownloadOutlined className="text-lg" />
                <span className="text-[13px] font-medium">PDF Fayli</span>
              </a>
            )}
          </div>
        </div>
      </Card>
    ))}
  </div>
);
