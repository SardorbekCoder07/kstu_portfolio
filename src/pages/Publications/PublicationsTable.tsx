import React from "react";
import { Button, Table, Image, Popconfirm, Space, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface PublicationItem {
  id: number;
  image: string;
  title: string;
}

interface PublicationsTableProps {
  data: PublicationItem[];
  isLoading: boolean;
  onEdit: (item: PublicationItem) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  isDeleting: boolean;
  emptyText?: string;
  onAdd?: () => void;
}

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
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Rasm",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (src: string, record: PublicationItem) =>
        src ? (
          <Image
            width={48}
            height={48}
            src={src}
            alt={record.title}
            preview={{ mask: "Ko'rish" }}
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
      dataIndex: "title",
      key: "title",
      render: (title: string) => <span className="font-medium">{title}</span>,
    },
    {
      title: "Amallar",
      key: "actions",
      width: 180,
      fixed: "right" as any,
      render: (_: any, record: PublicationItem) => (
        <Space size="small" className="flex flex-wrap">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Tahrirlash</span>
          </Button>
          <Popconfirm
            title="Publikatsiyani o'chirish"
            description="Haqiqatan ham bu publikatsiyani o'chirmoqchimisiz?"
            onConfirm={() => onDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deletingId === record.id && isDeleting}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">O'chirish</span>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {isLoading || data.length > 0 ? (
        <Table
          dataSource={data}
          columns={columns}
          loading={isLoading}
          pagination={false}
          bordered
          rowKey="id"
        />
      ) : (
        <Empty description={emptyText} />
      )}
    </div>
  );
};

export default PublicationsTable;
