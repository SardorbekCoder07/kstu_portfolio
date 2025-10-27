// src/pages/Position/index.tsx
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import { PageHeader } from '../../components/ui/PageHeader';
import { useModalStore } from '../../stores/useModalStore';
import { PositionCard } from './PositionCard';
import { PositionModal } from './PositionModal';
import { usePositionOperations } from '../../hooks/usePositionOperation';
import { Position } from '../../api/pagesApi/positionApi';

const PositionPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const { openModal, closeModal } = useModalStore();

  const {
    positions,
    loading,
    addPosition,
    editPosition,
    removePosition,
    isAdding, // Yangi state
    isEditing, // Yangi state
  } = usePositionOperations();

  const handleAddPosition = async (values: { name: string }, id?: number) => {
    // Bu function endi closeModal chaqirmaydi, modal o'zi yopiladi
    if (id) {
      const success = await editPosition(id, { name: values.name });
      if (success) {
        setEditingPosition(null);
      }
    } else {
      const success = await addPosition({ name: values.name });
      if (success) {
        // Add muvaffaqiyatli bo'lsa, modal avtomatik yopiladi
      }
    }
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    openModal();
  };

  const handleDeletePosition = async (id: number) => {
    await removePosition(id);
  };

  const handleOpenAddModal = () => {
    setEditingPosition(null);
    openModal();
  };

  const filteredPositions = positions.filter(pos =>
    pos.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Modal uchun loading state - add yoki edit bo'lsa true
  const modalLoading = isAdding || isEditing;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={positions.length}
        countLabel="Lavozimlar soni"
        searchPlaceholder="Lavozimlarni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Lavozim qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleOpenAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPositions.length > 0 ? (
            filteredPositions.map(position => (
              <PositionCard
                key={position.id}
                position={position}
                onEdit={handleEditPosition}
                onDelete={handleDeletePosition}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Empty
                description={
                  searchValue
                    ? 'Lavozimlar topilmadi'
                    : "Hozircha lavozimlar yo'q"
                }
              />
            </div>
          )}
        </div>
      )}

      <PositionModal
        editingPosition={editingPosition}
        onSubmit={handleAddPosition}
        loading={modalLoading} // Loading state uzatildi
      />
    </div>
  );
};

export default PositionPage;
