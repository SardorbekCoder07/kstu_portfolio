import { Button, Input, Modal, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface Faculty {
  id: number;
  name: string;
  imgUrl: string;
  departmentCount: number;
  departmentNames: string[];
}

interface FacultyModalProps {
  isOpen: boolean;
  onCancel: () => void;
  facultyName: string;
  onFacultyNameChange: (value: string) => void;
  editingFaculty: Faculty | null;
  fileList: UploadFile[];
  draggerProps: UploadProps;
  onSave: () => void;
  isSaving: boolean;
}

export const FacultyModal = ({
  isOpen,
  onCancel,
  facultyName,
  onFacultyNameChange,
  editingFaculty,
  fileList,
  draggerProps,
  onSave,
  isSaving,
}: FacultyModalProps) => {
  return (
    <Modal
      title={editingFaculty ? 'Fakultetni tahrirlash' : "Fakultet qo'shish"}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="font-medium text-gray-700">Fakultet nomi:</label>
          <Input
            placeholder="Masalan: Suniy intellekt"
            value={facultyName}
            onChange={e => onFacultyNameChange(e.target.value)}
          />
        </div>
        <div>
          <label className="font-medium text-gray-700 mb-2 block">
            Rasm yuklash (ixtiyoriy):
          </label>
          {editingFaculty && !fileList.length && editingFaculty.imgUrl && (
            <div className="mb-2">
              <Image
                src={editingFaculty.imgUrl}
                alt="Current"
                className="object-cover rounded"
                width={96}
                height={96}
                preview={{ mask: "Ko'rish" }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Hozirgi rasm (yangi rasm yuklash uchun faylni tanlang)
              </p>
            </div>
          )}
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Rasmni bu yerga torting yoki faylni tanlang
            </p>
            <p className="ant-upload-hint text-gray-500 text-sm">
              Faqat bitta rasmni yuklashingiz mumkin (max 5MB)
            </p>
          </Dragger>
        </div>
        <Button
          type="primary"
          block
          onClick={onSave}
          loading={isSaving}
          disabled={!facultyName.trim()}
        >
          {editingFaculty ? 'Yangilash' : 'Saqlash'}
        </Button>
      </div>
    </Modal>
  );
};
