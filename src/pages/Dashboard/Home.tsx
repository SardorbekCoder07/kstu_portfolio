import EcommerceMetrics from '../../components/ecommerce/EcommerceMetrics';
import MonthlySalesChart from '../../components/ecommerce/MonthlySalesChart';
import StatisticsChart from '../../components/ecommerce/StatisticsChart';
import PageMeta from '../../components/common/PageMeta';
export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Ekran bo‘ylab yoyilgan 4 ta card */}
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        {/* Quyidagilarni ham to‘liq ekranda qoldiramiz */}
        <div className="col-span-12">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        
      </div>
    </>
  );
}
