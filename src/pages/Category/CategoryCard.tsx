// src/components/cards/CategoryCard.tsx
import { Card, Popconfirm, Space, Button, Tag, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';

interface SubCategory {
  name: string;
}

interface CategoryCardProps {
  id: string;
  name: string;
  subCategories: SubCategory[];
  onEdit: (id: string, name: string, subCategories: SubCategory[]) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard = ({
  id,
  name,
  subCategories,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <Card hoverable className="shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium m-0">{name}</h3>
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(id, name, subCategories)}
              className="text-blue-600 hover:text-blue-700"
            />
            <Popconfirm
              title="Kategoriyani o'chirish"
              description="Bu kategoriyani o'chirishga ishonchingiz komilmi?"
              onConfirm={() => onDelete(id)}
              okText="Ha"
              cancelText="Yo'q"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </div>

        {subCategories && subCategories.length > 0 && (
          <>
            <Divider className="my-2" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <TagOutlined />
                <span>Sub kategoriyalar ({subCategories.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subCategories.map((sub, index) => (
                  <Tag key={index} color="blue" className="m-0">
                    {sub.name}
                  </Tag>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
