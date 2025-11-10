import StatCard from "./stat-card"
interface StatItem {
  id: string
  title: string
  count: number
  description: string
  details?: Array<{
    label: string
    value: number
    color: string
  }>
}

export default function StatisticsCards() {
  const stats: StatItem[] = [
    {
      id: "research",
      title: "Research",
      count: 5,
      description: "Active Projects",
    },
    {
      id: "publications",
      title: "Publications",
      count: 298,
      description: "Total Publications",
      details: [
        { label: "Articles", value: 180, color: "from-purple-500 to-blue-500" },
        { label: "Proceedings", value: 102, color: "from-cyan-500 to-blue-400" },
        { label: "Others", value: 16, color: "from-green-500 to-cyan-500" },
      ],
    },
    {
      id: "supervision",
      title: "Supervision",
      count: 21,
      description: "Students Supervised",
      details: [
        { label: "PhD Students", value: 4, color: "from-blue-600 to-blue-400" },
        { label: "Master Students", value: 17, color: "from-cyan-500 to-blue-400" },
      ],
    },
    {
      id: "consultation",
      title: "Consultation",
      count: 2,
      description: "Professional Engagements",
    },
    {
      id: "awards",
      title: "Awards & Recognitions",
      count: 54,
      description: "Total Awards",
      details: [
        { label: "Training & Internship", value: 41, color: "from-blue-600 to-blue-400" },
        { label: "Editorial Board", value: 4, color: "from-purple-600 to-purple-400" },
        { label: "Special Council", value: 4, color: "from-indigo-600 to-indigo-400" },
        { label: "Patent DGI", value: 3, color: "from-slate-700 to-slate-500" },
        { label: "State Award", value: 2, color: "from-red-500 to-red-400" },
      ],
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
