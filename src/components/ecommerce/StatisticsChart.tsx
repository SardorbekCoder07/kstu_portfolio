import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAgeStats, AgeGroupStats } from "../../api/pagesApi/statistics";

export default function AgeDistributionChart() {
  const { data, isLoading, isError } = useQuery<AgeGroupStats[]>({
    queryKey: ["age-distribution",1],
    queryFn: getAgeStats,
  });

  if (isLoading) return <div></div>;
  if (isError || !data)
    return <div className="text-red-500">Ma'lumotlarni yuklashda xatolik!</div>;

  const chartData = data.map((item) => ({
    name: item.ageGroup,
    male: item.maleCount,
    female: item.femaleCount,
  }));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Yosh bo'yicha taqsimot
        </h3>
      </div>

      <div className="w-full mt-4" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="4 4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="male"
              name="Erkaklar"
              stroke="#2864d4"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="female"
              name="Ayollar"
              stroke="red"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}