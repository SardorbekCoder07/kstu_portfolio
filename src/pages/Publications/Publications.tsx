import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import PublicationsTable from "./PublicationsTable"; // table component
import pub1 from "../../assets/images/image.png";
import pub2 from "../../assets/images/image.png";
import pub3 from "../../assets/images/image.png";

interface PublicationItem {
  id: number;
  image: string;
  title: string;
}

const Publications: React.FC = () => {
  // Boshlang'ich publikatsiyalar
  const initialData: PublicationItem[] = [
    { id: 1, image: pub1, title: "Algebra bo‘yicha maqola" },
    { id: 2, image: pub2, title: "Geometriya va topologiya tadqiqoti" },
    { id: 3, image: pub3, title: "Statistika va ehtimollik maqolasi" },
    { id: 4, image: pub1, title: "Matematika ta’lim metodikasi" },
    { id: 5, image: pub2, title: "Differensial tenglamalar bo‘yicha ish" },
    { id: 6, image: pub3, title: "Kiberxavfsizlik sohasidagi maqola" },
  ];

  const [data, setData] = useState<PublicationItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  // Qidiruv
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  // Qo‘shish funksiyasi
  const handleAdd = () => {
    const title = prompt("Publikatsiya nomini kiriting:");
    if (title && title.trim()) {
      const newItem: PublicationItem = {
        id: data.length + 1,
        image: pub1, // default rasm
        title: title.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }
  };

  // Edit funksiyasi
  const handleEdit = (item: PublicationItem) => {
    const newTitle = prompt("Publikatsiya nomini tahrirlash:", item.title);
    if (newTitle && newTitle.trim()) {
      setData(prev =>
        prev.map(d => (d.id === item.id ? { ...d, title: newTitle.trim() } : d))
      );
    }
  };

  // Delete funksiyasi
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu publikatsiyani o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Publikatsiyalar soni"
        searchPlaceholder="Publikatsiya qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Publikatsiya qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <PublicationsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Publikatsiya topilmadi"
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Publications;
