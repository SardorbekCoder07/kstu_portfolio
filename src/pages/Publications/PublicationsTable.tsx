// PublicationsTable.tsx
import React from "react";
import { Button, Table, Image, Popconfirm, Space, Empty } from "antd";
import { EditOutlined, DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";

/* ===================== TYPES ===================== */
export interface PublicationItem {
  id: number;
  name: string;
  fileUrl?: string | null;
  imgUrl?: string | null;
  description?: string;
  year?: number;
}

interface PublicationsTableProps {
  data: PublicationItem[];
  isLoading: boolean;
  onEdit: (item: PublicationItem) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  isDeleting: boolean;
  emptyText?: string;
}

/* ===================== COMPONENT ===================== */
const PublicationsTable: React.FC<PublicationsTableProps> = ({
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
      title: "Rasm",
      dataIndex: "imgUrl",
      key: "imgUrl",
      width: 80,
      render: (src: string | undefined, record: PublicationItem) =>
        src ? (
          <Image
            src={src}
            alt={record.name}
            width={48}
            height={48}
            preview={{ mask: "Ko‘rish" }}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">Yo'q</span>
          </div>
        ),
    },
    {
      title: "Publikatsiya nomi",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Tavsif",
      dataIndex: "description",
      key: "description",
      render: (description?: string) =>
        description ? (
          <span className="font-medium">
            {description.length > 30 ? description.slice(0, 30) + "..." : description}
          </span>
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
      render: (_: any, record: PublicationItem) => (
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
            title="Publikatsiyani o‘chirish"
            description="Haqiqatan ham bu publikatsiyani o‘chirmoqchimisiz?"
            onConfirm={() => onDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
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
          pagination={false}
          bordered
        />
      ) : (
        <Empty description={emptyText} />
      )}
    </>
  );
};

export default PublicationsTable;
