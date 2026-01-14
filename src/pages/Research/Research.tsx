import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import ResearchTable from "./ResearchTable";
import research1 from "../../assets/images/image.png";
import research2 from "../../assets/images/image.png";
import research3 from "../../assets/images/image.png";

interface ResearchItem {
  id: number;
  image: string;
  title: string;
}

const Research: React.FC = () => {
  // Static tadqiqotlar ma'lumotlari
  const initialData: ResearchItem[] = [
    { id: 1, image: research1, title: "Algebra va analiz tadqiqotlari" },
    { id: 2, image: research2, title: "Geometriya va topologiya tadqiqotlari" },
    { id: 3, image: research3, title: "Matematika ta’lim metodikasi" },
    { id: 4, image: research1, title: "Differensial tenglamalar tadqiqotlari" },
    { id: 5, image: research2, title: "Statistika va ehtimollik tadqiqotlari" },
    { id: 6, image: research3, title: "Kiberxavfsizlik bo‘yicha tadqiqotlar" },
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

  // Tadqiqot qo'shish funksiyasi (oddiy misol uchun prompt)
  const handleAdd = () => {
    const title = prompt("Tadqiqot nomini kiriting:");
    if (title && title.trim()) {
      const newItem: ResearchItem = {
        id: data.length + 1,
        image: research1, // default rasm
        title: title.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }
  };

  // Edit funksiyasi (prompt orqali)
  const handleEdit = (item: ResearchItem) => {
    const newTitle = prompt("Tadqiqot nomini tahrirlash:", item.title);
    if (newTitle && newTitle.trim()) {
      setData(prev =>
        prev.map(d => (d.id === item.id ? { ...d, title: newTitle.trim() } : d))
      );
    }
  };

  // Delete funksiyasi
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu tadqiqotni o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Tadqiqotlar soni"
        searchPlaceholder="Tadqiqot qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Tadqiqot qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <ResearchTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Tadqiqot topilmadi"
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Research;
