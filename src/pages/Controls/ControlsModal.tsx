import { Button, Input, Modal, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface Control {
  id: number;
  name: string;
  imgUrl: string;
  description?: string;
}

interface ControlsModalProps {
  isOpen: boolean;
  onCancel: () => void;
  controlName: string;
  onControlNameChange: (value: string) => void;
  editingControl: Control | null;
  fileList: UploadFile[];
  draggerProps: UploadProps;
  onSave: () => void;
  isSaving: boolean;
}

const ControlsModal = ({
  isOpen,
  onCancel,
  controlName,
  onControlNameChange,
  editingControl,
  fileList,
  draggerProps,
  onSave,
  isSaving,
}: ControlsModalProps) => {
  return (
    <Modal
      title={
        <span className="text-base sm:text-lg">
          {editingControl
            ? 'Nazoratni tahrirlash'
            : "Nazorat qo‘shish"}
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
        {/* Control Name */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Nazorat nomi:
          </label>
          <Input
            placeholder="Masalan: Oraliq nazorat (1-semestr)"
            value={controlName}
            onChange={e => onControlNameChange(e.target.value)}
            size="large"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-medium text-gray-700 text-sm sm:text-base mb-2 block">
            Rasm yuklash (ixtiyoriy):
          </label>

          {/* Current Image Preview */}
          {editingControl && !fileList.length && editingControl.imgUrl && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Image
                  src={editingControl.imgUrl}
                  alt="Current"
                  className="object-cover rounded"
                  width={80}
                  height={80}
                  preview={{ mask: "Ko‘rish" }}
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
              Faqat bitta rasm (max 5MB)
            </p>
          </Dragger>
        </div>

        {/* Save Button */}
        <Button
          type="primary"
          block
          onClick={onSave}
          loading={isSaving}
          disabled={!controlName.trim()}
          size="large"
          className="mt-2"
        >
          {editingControl ? 'Yangilash' : 'Saqlash'}
        </Button>
      </div>
    </Modal>
  );
};

export default ControlsModal;
