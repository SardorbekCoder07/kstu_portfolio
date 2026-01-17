import React from "react";
import { Button, Table, Popconfirm, Space, Empty } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

export interface ResearchItem {
  id: number;
  name: string;
  description: string;
  year: number;
  univerName: string;
  memberEnum: "MILLIY" | "XALQARO";
  finished: boolean;
  fileUrl: string | null;
  userId?: number;
}

interface ResearchTableProps {
  data: ResearchItem[];
  isLoading: boolean;
  onEdit: (item: ResearchItem) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  isDeleting: boolean;
  emptyText?: string;
}

const ResearchTable: React.FC<ResearchTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  deletingId,
  isDeleting,
  emptyText = "Ma'lumot topilmadi",
}) => {
  const columns = [
    {
      title: "№",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tadqiqot nomi",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-medium">{name || "—"}</span>
      ),
    },
    {
      title: "Tavsif",
      dataIndex: "description",
      key: "description",
      render: (desc: string) =>
        desc ? (
          desc.length > 30 ? (
            desc.slice(0, 30) + "..."
          ) : (
            desc
          )
        ) : (
          <span className="text-gray-400">Mavjud emas</span>
        ),
    },
    {
      title: "Fayl",
      dataIndex: "fileUrl",
      key: "fileUrl",
      width: 140,
      render: (fileUrl: string | null) =>
        fileUrl ? (
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            onClick={() => window.open(fileUrl, "_blank")}
          >
            PDF ko‘rish
          </Button>
        ) : (
          <span className="text-gray-400">Mavjud emas</span>
        ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_: any, record: ResearchItem) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Tahrirlash
          </Button>

          <Popconfirm
            title="Tadqiqotni o‘chirish"
            description="Haqiqatan ham bu tadqiqotni o‘chirmoqchimisiz?"
            onConfirm={() => onDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deletingId === record.id && isDeleting}
            >
              O‘chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {isLoading || data.length > 0 ? (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={isLoading}
          bordered
          pagination={{
            pageSize: 10,
            position: ["bottomRight"],
            showSizeChanger: false,
          }}
        />
      ) : (
        <Empty description={emptyText} />
      )}
    </>
  );
};

export default ResearchTable;
