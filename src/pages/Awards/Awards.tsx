import React, { useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/ui/PageHeader";
import AwardsTable from "./AwardsTable";
import award1 from "../../assets/images/image.png";
import award2 from "../../assets/images/image.png";
import award3 from "../../assets/images/image.png";

interface AwardItem {
  id: number;
  image: string;
  title: string;
}

const Awards: React.FC = () => {
  // Static awards data
  const initialData: AwardItem[] = [
    { id: 1, image: award1, title: "Matematika bo‘yicha mukofot" },
    { id: 2, image: award2, title: "Geometriya tadqiqotlari mukofoti" },
    { id: 3, image: award3, title: "Ta’lim metodikasi mukofoti" },
    { id: 4, image: award1, title: "Differensial tenglamalar bo‘yicha mukofot" },
    { id: 5, image: award2, title: "Statistika va ehtimollik mukofoti" },
    { id: 6, image: award3, title: "Kiberxavfsizlik mukofoti" },
  ];

  const [data, setData] = useState<AwardItem[]>(initialData);
  const [searchValue, setSearchValue] = useState("");

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, data]);

  // Add new award
  const handleAdd = () => {
    const title = prompt("Mukofot nomini kiriting:");
    if (title && title.trim()) {
      const newItem: AwardItem = {
        id: data.length + 1,
        image: award1, // default rasm
        title: title.trim(),
      };
      setData(prev => [newItem, ...prev]);
    }
  };

  // Edit award
  const handleEdit = (item: AwardItem) => {
    const newTitle = prompt("Mukofot nomini tahrirlash:", item.title);
    if (newTitle && newTitle.trim()) {
      setData(prev =>
        prev.map(d => (d.id === item.id ? { ...d, title: newTitle.trim() } : d))
      );
    }
  };

  // Delete award
  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham bu mukofotni o'chirmoqchimisiz?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        count={filteredData.length}
        countLabel="Mukofotlar soni"
        searchPlaceholder="Mukofotni qidirish..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        buttonText="Mukofot qo‘shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleAdd}
      />

      <AwardsTable
        data={filteredData}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={null}
        isDeleting={false}
        emptyText="Mukofot topilmadi"
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Awards;
