import { useQuery } from "@tanstack/react-query";
import { GraduationCap, User, Users } from "lucide-react";
import { getDashboardStats } from "../../api/pagesApi/statistics";

export default function EcommerceMetrics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats
  });

  if (isLoading) return <div>Loading metrics...</div>;
  if (isError || !data)
    return <div className="text-red-500">Ma'lumotlarni yuklashda xatolik!</div>;

  const { countAllUsers, countAcademic, countFemale, countMale } = data;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GraduationCap className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              With Academic Degrees
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {countAcademic}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <User className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Male Teachers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {countMale}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <User className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Female Teachers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {countFemale}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              All Teachers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {countAllUsers}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
