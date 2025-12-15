import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart, Sector, Tooltip, Cell } from "recharts";
import { GenderStats, getGenderStats } from "../../api/pagesApi/statistics";

const COLORS = ["#0088FE", "#FF8042"];

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.name} ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >{`(${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

export default function GenderPieChart({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const {
    data: genderData,
    isLoading,
    isError,
  } = useQuery<GenderStats>({
    queryKey: ["gender"],
    queryFn: getGenderStats,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !genderData) return <div>Error loading gender stats</div>;

  const chartData = [
    { name: "Male", value: genderData.maleCount },
    { name: "Female", value: genderData.femaleCount },
  ];

  return (
    <PieChart width={500} height={500} className="mt-[-4rem]">
      <Pie
        activeShape={renderActiveShape}
        data={chartData}
        cx="50%"
        cy="45%"
        innerRadius={80}
        outerRadius={120}
        dataKey="value"
        isAnimationActive={isAnimationActive}
        label={({ cx, cy, midAngle = 0, outerRadius, index }) => {
          const RADIAN = Math.PI / 180;
          const radius = outerRadius + 15;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return (
            <text
              x={x}
              y={y}
              fill={COLORS[index % COLORS.length]}
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
              fontWeight="bold"
            >
              {chartData[index].name}
            </text>
          );
        }}
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  );
}
