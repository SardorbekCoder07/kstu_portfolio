import { Button, Input, Modal, Select, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface Faculty {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  facultyId: number;
  imgUrl?: string;
}

interface DepartmentModalProps {
  isOpen: boolean;
  onCancel: () => void;
  departmentName: string;
  onDepartmentNameChange: (value: string) => void;
  selectedFacultyId: number | null;
  onFacultySelect: (value: number) => void;
  faculties: Faculty[];
  editingDepartment: Department | null;
  fileList: UploadFile[];
  draggerProps: UploadProps;
  onSave: () => void;
  isSaving: boolean;
}

export const DepartmentModal = ({
  isOpen,
  onCancel,
  departmentName,
  onDepartmentNameChange,
  selectedFacultyId,
  onFacultySelect,
  faculties,
  editingDepartment,
  fileList,
  draggerProps,
  onSave,
  isSaving,
}: DepartmentModalProps) => {
  
  return (
    <Modal
      title={
        <span className="text-base sm:text-lg">
          {editingDepartment ? 'Kafedrani tahrirlash' : "Kafedra qo'shish"}
        </span>
      }
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: '600px' }}
      centered
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* Faculty Select */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Fakultetni tanlang:
          </label>
          <Select
            showSearch
            placeholder="Fakultetni tanlang..."
            value={selectedFacultyId ?? undefined}
            onChange={onFacultySelect}
            size="large"
            className="w-full"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={faculties.map(f => ({
              label: f.name,
              value: f.id,
            }))}
          />
        </div>

        {/* Department Name Input */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Kafedra nomi:
          </label>
          <Input
            placeholder="Masalan: Kompyuter injiniringi"
            value={departmentName}
            onChange={e => onDepartmentNameChange(e.target.value)}
            size="large"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Rasm yuklash (ixtiyoriy):
          </label>

          {editingDepartment &&
            !fileList.length &&
            editingDepartment.imgUrl && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Image
                    src={editingDepartment.imgUrl}
                    alt="Current"
                    className="object-cover rounded"
                    width={80}
                    height={80}
                    preview={{ mask: "Ko'rish" }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Hozirgi rasm
                    </p>
                    <p className="text-xs text-gray-500">
                      Yangi rasm yuklash uchun quyida faylni tanlang
                    </p>
                  </div>
                </div>
              </div>
            )}

          <Dragger {...draggerProps} className="upload-dragger-responsive">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: '36px' }} />
            </p>
            <p className="ant-upload-text text-sm sm:text-base px-4">
              Rasmni bu yerga torting yoki faylni tanlang
            </p>
            <p className="ant-upload-hint text-gray-500 text-xs sm:text-sm px-4">
              Faqat bitta rasmni yuklashingiz mumkin (max 5MB)
            </p>
          </Dragger>
        </div>

        <Button
          type="primary"
          block
          onClick={onSave}
          loading={isSaving}
          disabled={!departmentName.trim() || !selectedFacultyId}
          size="large"
          className="mt-2"
        >
          {editingDepartment ? 'Yangilash' : 'Saqlash'}
        </Button>
      </div>
    </Modal>
  );
};
