import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ConsultationsTable from "./ConsultationsTable";
import consult1 from "../../assets/images/image.png";
import consult2 from "../../assets/images/image.png";
import consult3 from "../../assets/images/image.png";

export interface ConsultationItem {
  id: number;
  image: string;
  title: string;
}

const Consultations: React.FC = () => {
  const initialData: ConsultationItem[] = [
    { id: 1, image: consult1, title: "Matematika bo‘yicha maslahat" },
    { id: 2, image: consult2, title: "Geometriya tadqiqotlari bo‘yicha maslahat" },
    { id: 3, image: consult3, title: "Ta’lim metodikasi bo‘yicha maslahat" },
    { id: 4, image: consult1, title: "Differensial tenglamalar bo‘yicha maslahat" },
    { id: 5, image: consult2, title: "Statistika va ehtimollik bo‘yicha maslahat" },
    { id: 6, image: consult3, title: "Kiberxavfsizlik bo‘yicha maslahat" },
  ];

  const [data, setData] = useState<ConsultationItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  const handleAdd = () => {
    const title = prompt("Maslahat nomini kiriting:");
    if (title && title.trim()) {
      const newItem: ConsultationItem = {
        id: data.length + 1,
        image: consult1,
        title: title.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }
  };

  const handleEdit = (item: ConsultationItem) => {
    const newTitle = prompt("Maslahat nomini tahrirlash:", item.title);
    if (newTitle && newTitle.trim()) {
      setData(prev =>
        prev.map(d => (d.id === item.id ? { ...d, title: newTitle.trim() } : d))
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu maslahatni o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Maslahatlar soni"
        searchPlaceholder="Maslahatni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Maslahat qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <ConsultationsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Maslahat topilmadi"
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Consultations;
