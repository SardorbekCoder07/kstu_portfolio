import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ControlsTable from "./ControlsTable"; // table component
import research1 from "../../assets/images/image.png";
import research2 from "../../assets/images/image.png";
import research3 from "../../assets/images/image.png";
import ControlsModal from "./ControlsModal";

interface ResearchItem {
  id: number;
  image: string;
  title: string;
}

const Controls: React.FC = () => {
  // Boshlang'ich Nazoratlar
  const initialData: ResearchItem[] = [
    { id: 1, image: research1, title: "Algebra va analiz Nazoratlari" },
    { id: 2, image: research2, title: "Geometriya va topologiya Nazoratlari" },
    { id: 3, image: research3, title: "Matematika ta’lim metodikasi" },
    { id: 4, image: research1, title: "Differensial tenglamalar Nazoratlari" },
    { id: 5, image: research2, title: "Statistika va ehtimollik Nazoratlari" },
    { id: 6, image: research3, title: "Kiberxavfsizlik bo‘yicha Nazoratlar" },
  ];

  const [data, setData] = useState<ResearchItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  // Nazorat qo'shish
  const handleAdd = () => {
    const title = prompt("Nazorat nomini kiriting:");
    if (title && title.trim()) {
      const newItem: ResearchItem = {
        id: data.length + 1,
        image: research1, // default rasm
        title: title.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }
  };

  // Edit
  const handleEdit = (item: ResearchItem) => {
    const newTitle = prompt("Nazorat nomini tahrirlash:", item.title);
    if (newTitle && newTitle.trim()) {
      setData(prev =>
        prev.map(d => (d.id === item.id ? { ...d, title: newTitle.trim() } : d))
      );
    }
  };

  // Delete
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu Nazoratni o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Nazoratlar soni"
        searchPlaceholder="Nazoratlar qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Nazorat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <ControlsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Nazorat topilmadi"
        onAdd={handleAdd}
      />

      <ControlsModal
        isOpen={isOpen}
        onCancel={resetForm}
        facultyName={facultyName}
        onFacultyNameChange={setFacultyName}
        editingFaculty={editingFaculty}
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Controls;
