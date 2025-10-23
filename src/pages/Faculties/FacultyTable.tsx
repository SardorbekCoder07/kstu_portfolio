import { Button, Popconfirm, Space, Image, Tag, Empty } from 'antd';
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
  isKafedra?: boolean;
  emptyText: string;
}

export const FacultyTable = ({
  faculties,
  isLoading,
  onEdit,
  onDelete,
  deletingId,
  isDeleting,
  isKafedra,
  emptyText,
}: FacultyTableProps) => {
  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      responsive: ['md'] as any,
      render: (_: any, __: any, index: number) => (
        <span className="font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'Rasm',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 80,
      render: (imgUrl: string, record: Faculty) => (
        <div className="flex items-center gap-2">
          {imgUrl && imgUrl !== 'string' ? (
            <Image
              src={imgUrl}
              alt={record.name}
              className="object-cover rounded"
              width={48}
              height={48}
              preview={{ mask: "Ko'rish" }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Yo'q</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: isKafedra ? 'Kafedra' : 'Fakultet',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Faculty) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{name}</span>
          <span className="text-xs text-gray-500 lg:hidden">
            Kafedralar: {record.departmentCount}
          </span>
        </div>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 180,
      fixed: 'right' as any,
      render: (_: any, record: Faculty) => (
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
            title={
              <span className="text-sm sm:text-base">Fakultetni o'chirish</span>
            }
            description={
              <span className="text-xs sm:text-sm">
                Haqiqatan ham bu fakultetni o'chirmoqchimisiz?
              </span>
            }
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
    <div className="bg-transparent  overflow-hidden">
      {faculties.length > 0 ? (
        <CustomTable columns={columns} data={faculties} loading={isLoading} />
      ) : (
        <div className="col-span-full">
          <Empty description={emptyText} />
        </div>
      )}
    </div>
  );
};
