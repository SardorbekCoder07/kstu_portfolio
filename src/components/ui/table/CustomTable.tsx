import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CustomTableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  rowKey?: string;
  bordered?: boolean;
  pagination?: boolean;
}

const CustomTable = <T extends object>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  bordered = true,
}: CustomTableProps<T>) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered={bordered}
      rowKey={rowKey}
      className="shadow-sm rounded-lg"
    />
  );
};

export default CustomTable;
