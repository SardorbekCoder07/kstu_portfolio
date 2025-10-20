import { Button, Input, message, Modal, Upload } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { useModalStore } from '../../stores/useModalStore';
import CustomTable from '../../components/ui/table/CustomTable';
import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger';

const Faculties = () => {
  const { isOpen, openModal, closeModal } = useModalStore();
  const [facultyName, setFacultyName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    { id: 1, name: 'Computer Science', count: 120 },
    { id: 2, name: 'Mathematics', count: 80 },
  ]);

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Faculty Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Students Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <div className="  flex flex-col gap-6">
      {/* 🔹 Yuqori qism — input + button */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
        {/* Chap tomon */}
        <div className="flex items-center gap-3 w-1/2">
          <label className="text-gray-700 font-medium whitespace-nowrap">
            Fakultetlar soni: 35
          </label>
        </div>

        {/* O'ng tomon */}
        <div className="flex items-center gap-3 w-1/2">
          <Input
            placeholder="Fakultetni qidirish..."
            type="text"
            className="w-full"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Faculty
          </Button>
        </div>
      </div>

      {/* 🔹 Pastki qism — Table */}
      <CustomTable columns={columns} data={data} />

      {/* 🔹 Modal */}
      <Modal
        title="Add Faculty"
        open={isOpen}
        onCancel={closeModal}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          {/* Faculty name input */}
          <div>
            <label className="font-medium text-gray-700">Faculty Name:</label>
            <Input placeholder="Masalan: Computer Science" />
          </div>

          {/* Image upload */}
          <div>
            <label className="font-medium text-gray-700 mb-2 block">
              Rasm joylash:
            </label>
            <Dragger
              name="facultyImage"
              multiple={false}
              beforeUpload={() => false} // avtomatik yuklashni o‘chiradi
              maxCount={1}
              onChange={info => {
                const file = info.file.originFileObj;
                if (file) {
                  message.success(`${file.name} muvaffaqiyatli tanlandi`);
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Rasmni bu yerga torting yoki faylni tanlang
              </p>
              <p className="ant-upload-hint text-gray-500 text-sm">
                Faqat bitta rasmni tanlashingiz mumkin
              </p>
            </Dragger>
          </div>

          {/* Saqlash tugmasi */}
          <Button type="primary" block>
            Saqlash
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Faculties;
