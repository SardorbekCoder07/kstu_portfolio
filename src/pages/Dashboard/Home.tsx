import EcommerceMetrics from '../../components/ecommerce/EcommerceMetrics';
import MonthlySalesChart from '../../components/ecommerce/MonthlySalesChart';
import StatisticsChart from '../../components/ecommerce/StatisticsChart';
import PageMeta from '../../components/common/PageMeta';
import { Button, Modal } from 'antd';
import { useModalStore } from '../../stores/useModalStore';
import { toast } from 'sonner';
export default function Home() {
  const { openModal, isOpen, closeModal } = useModalStore();
  const handleOk = () => {
    toast.success("Ma'lumot muvaffaqiyatli saqlandi ✅");
    closeModal();
  };

  const handleCancel = () => {
    toast.warning('Modal yopildi ⚠️');
    closeModal();
  };
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

        <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-700">
            Modal boshqaruvi 🎯
          </h1>
          <Button type="primary" onClick={openModal}>
            Modalni ochish
          </Button>

          <Modal
            title="Zustand bilan Modal boshqaruvi"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Saqlash"
            cancelText="Bekor qilish"
          >
            <p>Bu modalni Zustand orqali boshqarayapsan 😎</p>
          </Modal>
        </div>
      </div>
    </>
  );
}
