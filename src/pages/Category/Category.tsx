// src/pages/Category/index.tsx
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Empty } from 'antd';
import { PageHeader } from '../../components/ui/PageHeader';
import { useModalStore } from '../../stores/useModalStore';
import { CategoryCard } from './CategoryCard';
import { CategoryModal } from './CategoryModal';

interface SubCategory {
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const Category = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { openModal } = useModalStore();
  console.log(categories);

  const handleAddCategory = (
    values: { name: string; subCategories?: SubCategory[] },
    id?: string
  ) => {
    if (id) {
      // Tahrirlash
      setCategories(prev =>
        prev.map(cat =>
          cat.id === id
            ? {
                ...cat,
                name: values.name,
                subCategories: values.subCategories || [],
              }
            : cat
        )
      );
      setEditingCategory(null);
    } else {
      // Qo'shish
      const newCategory: Category = {
        id: Date.now().toString(),
        name: values.name,
        subCategories: values.subCategories || [],
      };
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleEditCategory = (
    id: string,
    name: string,
    subCategories: SubCategory[]
  ) => {
    setEditingCategory({ id, name, subCategories });
    openModal();
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    message.success("Kategoriya muvaffaqiyatli o'chirildi");
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    openModal();
  };

  const filteredCategories = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      cat.subCategories.some(sub =>
        sub.name.toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={categories.length}
        countLabel="Kategoriyalar soni"
        searchPlaceholder="Kategoriya yoki sub kategoriyani qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Kategoriya qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleOpenAddModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              subCategories={category.subCategories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))
        ) : (
          <div className="col-span-full">
            <Empty
              description={
                searchValue
                  ? 'Kategoriya topilmadi'
                  : "Hozircha kategoriyalar yo'q"
              }
            />
          </div>
        )}
      </div>

      <CategoryModal
        editingCategory={editingCategory}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default Category;
