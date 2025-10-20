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
      title={
        <span className="text-base sm:text-lg">
          {editingFaculty ? 'Fakultetni tahrirlash' : "Fakultet qo'shish"}
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
        {/* Faculty Name Input */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Fakultet nomi:
          </label>
          <Input
            placeholder="Masalan: Suniy intellekt"
            value={facultyName}
            onChange={e => onFacultyNameChange(e.target.value)}
            size="large"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Rasm yuklash (ixtiyoriy):
          </label>

          {/* Current Image Preview */}
          {editingFaculty && !fileList.length && editingFaculty.imgUrl && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Image
                  src={editingFaculty.imgUrl}
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

          {/* Upload Dragger */}
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

        {/* Save Button */}
        <Button
          type="primary"
          block
          onClick={onSave}
          loading={isSaving}
          disabled={!facultyName.trim()}
          size="large"
          className="mt-2"
        >
          {editingFaculty ? 'Yangilash' : 'Saqlash'}
        </Button>
      </div>
    </Modal>
  );
};
