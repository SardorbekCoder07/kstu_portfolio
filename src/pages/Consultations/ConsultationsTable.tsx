import React, { useMemo } from "react";
import { Button, Table, Image, Popconfirm, Space, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export interface ConsultationItem {
  id: number;
  title: string;
  imgUrl?: string | null;
  fileUrl?: string | null;
  description?: string;
}

interface ConsultationsTableProps {
  data: ConsultationItem[];
  isLoading: boolean;
  onEdit: (item: ConsultationItem) => void;
  onDelete: (id: number) => void;
  deletingId?: number | null;
  isDeleting?: boolean;
  emptyText?: string;
  onAdd?: () => void;
}

const ConsultationsTable: React.FC<ConsultationsTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  deletingId = null,
  isDeleting = false,
  emptyText = "Ma'lumot topilmadi",
}) => {
  const columns = useMemo(
    () => [
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
        render: (src: string | undefined, record: ConsultationItem) =>
          src ? (
            <Image
              src={src}
              alt={record.title}
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
        title: "Maslahat nomi",
        dataIndex: "title",
        key: "title",
        render: (title: string) => <span className="font-medium">{title}</span>,
      },
      {
        title: "Tavsif",
        dataIndex: "description",
        key: "description",
        render: (desc?: string) =>
          desc ? (
            <span className="text-gray-700">
              {desc.length > 30 ? desc.slice(0, 30) + "..." : desc}
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
        render: (fileUrl?: string | null) =>
          fileUrl ? (
            <Button
              type="link"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              Fayl ko‘rish
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
        render: (_: any, record: ConsultationItem) => (
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
              title="Maslahatni o‘chirish"
              description="Haqiqatan ham bu maslahatni o‘chirmoqchimisiz?"
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
    ],
    [deletingId, isDeleting]
  );

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

export default ConsultationsTable;
