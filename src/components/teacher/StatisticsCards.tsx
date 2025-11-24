import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import StatCard from "./stat-card";
import axiosClient from "../../api/axiosClient";

interface StatItem {
  id: string;
  title: string;
  count: number;
  description: string;
  details?: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

// Ma'lumotni olish funksiyasi
const fetchStatistics = async (teacherId: string): Promise<StatItem[]> => {
  const res = await axiosClient.get(`/user/statistics/${teacherId}`);
  const data = res.data.data;

  return [
    {
      id: "research",
      title: "Tadqiqotlar",
      count: data.tadqiqotlar,
      description: "Faol loyihalar",
    },
    {
      id: "publications",
      title: "Nashrlar",
      count: data.nashrlar,
      description: "Jami nashrlar",
      details: [
        {
          label: "Maqolalar",
          value: data.maqolalar,
          color: "from-purple-500 to-blue-500",
        },
        {
          label: "Kitoblar",
          value: data.kitoblar,
          color: "from-cyan-500 to-blue-400",
        },
        {
          label: "Boshqalar",
          value: data.boshqalar,
          color: "from-green-500 to-cyan-500",
        },
      ],
    },
    {
      id: "supervision",
      title: "Nazorat va Rahbarlik",
      count: data.ishYuritishlar,
      description: "Talabalar soni",
      details: [
        {
          label: "Maslahatlar",
          value: data.maslahatlar,
          color: "from-blue-600 to-blue-400",
        },
        {
          label: "Nazorat",
          value: data.nazorat,
          color: "from-cyan-500 to-blue-400",
        },
      ],
    },
    {
      id: "training",
      title: "Trening va Faoliyat",
      count: data.treninglar,
      description: "Professional faoliyat",
      details: [
        {
          label: "Tahririyat a’zoligi",
          value: data.tahririyatAzolik,
          color: "from-purple-600 to-purple-400",
        },
        {
          label: "Maxsus kengash",
          value: data.maxsusKengash,
          color: "from-indigo-600 to-indigo-400",
        },
      ],
    },
    {
      id: "awards",
      title: "Mukofotlar",
      count: data.mukofotlar,
      description: "Jami mukofotlar",
      details: [
        {
          label: "Patent DGI",
          value: data.patentlar,
          color: "from-slate-700 to-slate-500",
        },
        {
          label: "Davlat mukofotlari",
          value: data.davlatMukofotlari,
          color: "from-red-500 to-red-400",
        },
      ],
    },
  ];
};

export default function StatisticsCards() {
  const { id } = useParams<{ id: string }>(); // URL’dan teacherId ni olish

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery<StatItem[], Error>({
    queryKey: ["statistics", id],
    queryFn: () => fetchStatistics(id!), // <-- teacherId yuborilyapti
    enabled: !!id, // id bo‘lmasa query ishlamaydi
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (isLoading)
    return <p className="text-center">Statiistikalar Yuklanmoqda...</p>;
  if (isError)
    return <p className="text-center text-red-500">Xatolik: {error.message}</p>;

  return (
    <div className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats?.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
