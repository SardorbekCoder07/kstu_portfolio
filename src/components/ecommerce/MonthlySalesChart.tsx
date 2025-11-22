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
} from "recharts";
import { getLavozimStatistics, LavozimStats } from "../../api/pagesApi/statistics";

const VerticalComposedChart = () => {
  const { data, isError } = useQuery<LavozimStats[]>({
    queryKey: ["lavozim"],
    queryFn: getLavozimStatistics, 
  });

  const chartData = data || [];

  if (isError) {
    return <div className="text-red-500">Ma'lumotlarni yuklashda xatolik!</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        layout="vertical"
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          scale="band"
          width={120}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalEmployees" barSize={20} fill="#413ea0" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;