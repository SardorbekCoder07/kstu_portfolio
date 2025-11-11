interface DetailItem {
  label: string
  value: number
  color: string
}

interface StatCardProps {
  stat: {
    id: string
    title: string
    count: number
    description: string
    details?: DetailItem[]
  }
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}  
      <div className="bg-[#1677ff] px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm md:text-base">{stat.title}</h3>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        Main Count
        <div className="mb-4">
          <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.count}</div>
          <p className="text-xs md:text-sm text-slate-600">{stat.description}</p>
        </div>

        {/* Details/Media Section */}
        {stat.details && stat.details.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-4">
            {stat.details.map((detail, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${detail.color}`} />
                  <span className="text-xs text-slate-700 font-medium">{detail.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}