import { Button, Popconfirm, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomTable from '../../components/ui/table/CustomTable';


interface Faculty {
  id: number;
  name: string;
  imgUrl: string;
  departmentCount: number;
  departmentNames: string[];
}

interface FacultyTableProps {
  faculties: Faculty[];
  isLoading: boolean;
  onEdit: (faculty: Faculty) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  isDeleting: boolean;
}

export const FacultyTable = ({
  faculties,
  isLoading,
  onEdit,
  onDelete,
  deletingId,
  isDeleting,
}: FacultyTableProps) => {
  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Fakultet nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Bo'limlar soni",
      dataIndex: 'departmentCount',
      key: 'departmentCount',
      width: 150,
    },
    {
      title: 'Rasm',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 100,
      render: (imgUrl: string) =>
        imgUrl && imgUrl !== 'string' ? (
          <Image
            src={imgUrl}
            alt="Faculty"
            className="object-cover rounded"
            width={48}
            height={48}
            preview={{ mask: "Ko'rish" }}
          />
        ) : (
          <span className="text-gray-400">Rasm yo'q</span>
        ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 200,
      render: (_: any, record: Faculty) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Fakultetni o'chirish"
            description="Haqiqatan ham bu fakultetni o'chirmoqchimisiz?"
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
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <CustomTable columns={columns} data={faculties} loading={isLoading} />;
};
