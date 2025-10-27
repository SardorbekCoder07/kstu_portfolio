// src/pages/Position/PositionCard.tsx
import { Card, Popconfirm, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Position } from '../../api/pagesApi/positionApi';

interface PositionCardProps {
  position: Position;
  onEdit: (position: Position) => void;
  onDelete: (id: number) => void; // string -> number
}

export const PositionCard = ({
  position,
  onEdit,
  onDelete,
}: PositionCardProps) => {
  return (
    <Card hoverable className="shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium m-0">{position.name}</h3>
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(position)}
            className="text-blue-600 hover:text-blue-700"
          />
          <Popconfirm
            title="Lavozimni o'chirish"
            description="Bu lavozimni o'chirishga ishonchingiz komilmi?"
            onConfirm={() => onDelete(position.id)}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
};
