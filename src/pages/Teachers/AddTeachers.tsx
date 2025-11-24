import { PageHeader } from "../../components/ui/PageHeader";
import {
  PlusOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDrawerStore } from "../../stores/useDrawerStore";
import { TeacherSidebar } from "./TeacherSidebar";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Empty,
  Spin,
  Pagination,
  Select,
  Space,
  Modal,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useTeacherOperations } from "../../hooks/useTeacherOperation";
import { useDepartmentOperations } from "../../hooks/useDepartmentOperation";
import { usePositionOperations } from "../../hooks/usePositionOperation";
import axiosClient from "../../api/axiosClient";

const { confirm } = Modal;

interface Teacher {
  id: number;
  fullName: string;
  lavozim: string;
  email: string;
  imgUrl: string;
  input: string;
  phoneNumber: string;
  departmentName: string;
  age?: number;
  gender?: boolean;
  biography?: string;
  profession?: string;
}

const AddTeachers = () => {
  const { openDrawer, closeDrawer } = useDrawerStore();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [selectedLavozim, setSelectedLavozim] = useState<string | undefined>(
    undefined
  );
  const [selectedCollege, setSelectedCollege] = useState<string | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTeacher, setSelectedTeacher] = useState<Partial<Teacher> | undefined>(
    undefined
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    teachers,
    total,
    isTeachersLoading,
    createTeacherMutation,
    updateTeacherMutation,
    uploadImageMutation,
    uploadPDFMutation,
    refetch,
  } = useTeacherOperations(
    {
      page: currentPage - 1,
      size: pageSize,
      name: searchValue.trim() || undefined,
      lavozim: selectedLavozim,
      college: selectedCollege,
    },
    closeDrawer
  );

  // ✅ Barcha kafedralarni olish (collegeName bilan)
  const { allDepartments, isAllDepartmentsLoading } = useDepartmentOperations();
  const { positions } = usePositionOperations();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedLavozim, selectedCollege]);

  const handleViewDetails = (teacherId: number) => {
    navigate(`/teachers/${teacherId}`);
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(undefined);
    setIsEditMode(false);
    openDrawer();
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher({
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      biography: teacher.biography || "",
      input: teacher.input || "",
      profession: teacher.profession || "",
      imgUrl: teacher.imgUrl,
      age: teacher.age,
      gender: teacher.gender,
    });
    setIsEditMode(true);
    openDrawer();
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    confirm({
      title: "Ushbu o'qituvchini o'chirmoqchimisiz?",
      icon: <ExclamationCircleOutlined />,
      content: "O'chirish qaytarib bo'lmaydigan amal.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        try {
          await axiosClient.delete(`/user/${teacherId}`);
          message.success("O'qituvchi muvaffaqiyatli o'chirildi");
          refetch();
        } catch (err: any) {
          console.error(err);
          message.error("O'chirishda xatolik yuz berdi");
        }
      },
    });
  };

  const lavozimOptions = positions.map((pos) => ({
    label: pos.name,
    value: pos.name,
  }));

  // ✅ allDepartments dan foydalanish - name ni ko'rsatamiz
  const collegeOptions = allDepartments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={total}
        countLabel="O'qituvchilar soni"
        searchPlaceholder="O'qituvchini qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Ustoz qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAddTeacher}
      />

      {/* Filterlar */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Space size="middle" wrap className="w-full">
          <Select
            placeholder="Lavozim bo'yicha"
            style={{ width: 200 }}
            allowClear
            value={selectedLavozim}
            onChange={setSelectedLavozim}
            options={lavozimOptions}
          />

          <Select
            placeholder="Kafedra bo'yicha"
            style={{ width: 200 }}
            allowClear
            value={selectedCollege}
            onChange={setSelectedCollege}
            options={collegeOptions}
            loading={isAllDepartmentsLoading}
          />

          {(selectedLavozim || selectedCollege) && (
            <Button
              onClick={() => {
                setSelectedLavozim(undefined);
                setSelectedCollege(undefined);
                setSearchValue("");
              }}
            >
              Filtrlarni tozalash
            </Button>
          )}
        </Space>
      </div>

      <div className="bg-transparent">
        {isTeachersLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {teachers.map((teacher) => (
                <Col xs={24} sm={12} md={8} lg={6} key={teacher.id}>
                  <Card
                    hoverable
                    className="overflow-hidden"
                    styles={{ body: { padding: "16px" } }}
                    cover={
                      <div className="relative w-full h-72 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                        {teacher.imgUrl ? (
                          <img
                            src={teacher.imgUrl}
                            alt={teacher.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserOutlined className="text-6xl text-blue-400" />
                          </div>
                        )}
                      </div>
                    }
                  >
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-gray-800 truncate">
                        {teacher.fullName}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600 truncate">
                          {teacher.lavozim}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {teacher.departmentName}
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-300 pt-2 cursor-pointer"></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 justify-between">
                          <Button
                            danger
                            block
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTeacher(teacher.id);
                            }}
                          >
                            <DeleteOutlined />
                            Delete
                          </Button>

                          <Button
                            style={{
                              borderColor: "#eab308",
                              color: "#eab308",
                            }}
                            block
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTeacher(teacher);
                              console.log(teacher);
                            }}
                          >
                            <EditOutlined />
                            Tahrirlash
                          </Button>
                        </div>
                        <Button
                          type="primary"
                          block
                          onClick={() => handleViewDetails(teacher.id)}
                        >
                          <p className="!m-0">Batafsil</p>
                          <RightOutlined size={10} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {teachers.length === 0 && !isTeachersLoading && (
              <div className="flex justify-center py-20">
                <Empty description="O'qituvchi topilmadi" />
              </div>
            )}

            {total > 0 && (
              <div className="flex justify-end mt-8">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  onShowSizeChange={setPageSize}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} / ${total} ta`
                  }
                  pageSizeOptions={["10", "20", "30", "50"]}
                  locale={{
                    items_per_page: "/ sahifa",
                    jump_to: "O'tish",
                    page: "Sahifa",
                  }}
                />
              </div>
            )}
          </>
        )}
        <TeacherSidebar
          initialValues={selectedTeacher}
          editMode={isEditMode}
          createMutation={createTeacherMutation}
          updateMutation={updateTeacherMutation}
          uploadImageMutation={uploadImageMutation}
          uploadPDFMutation={uploadPDFMutation}
          departmentList={allDepartments}
          positionList={positions}
        />
      </div>
    </div>
  );
};

export default AddTeachers;