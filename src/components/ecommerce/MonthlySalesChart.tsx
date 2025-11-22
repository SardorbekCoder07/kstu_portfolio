import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  getLavozimStatistics,
  LavozimStats,
  LavozimStatisticsResult,
} from "../../api/pagesApi/statistics";

const VerticalComposedChart = () => {
  const { data, isError } = useQuery<LavozimStatisticsResult>({
    queryKey: ["lavozim"],
    queryFn: getLavozimStatistics,
  });

  if (isError) {
    return (
      <div className="text-red-500">
        Ma'lumotlarni yuklashda xatolik!
      </div>
    );
  }

  // API dan: { total, data: [...] }
  const total = data?.total || 1;
  const list = data?.data || [];

  // ➤ Har bir elementga foiz hisoblab beramiz
  const chartData = list.map((item) => ({
    ...item,
    percentage: Number(((item.totalEmployees / total) * 100).toFixed(1)),
  }));

  console.log(chartData);

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ComposedChart
        layout="vertical"
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={130} />

        <Tooltip />

        <Legend />

        <Bar dataKey="totalEmployees" barSize={20} fill="#413ea0">
          {/* ➤ Ustun yuqoriga foiz textini chiqaradi */}
          <LabelList
            dataKey="percentage"
            position="right"
            formatter={(v: number) => `${v}%`}
          />
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;