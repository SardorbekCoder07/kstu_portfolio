// src/pages/Position/PositionModal.tsx
import { Modal, Form, Input, Spin } from 'antd';
import { useEffect } from 'react';
import { useModalStore } from '../../stores/useModalStore';
import { Position } from '../../api/pagesApi/positionApi';

interface PositionFormValues {
  name: string;
}

interface PositionModalProps {
  editingPosition: Position | null;
  onSubmit: (values: PositionFormValues, id?: number) => Promise<void>;
  loading?: boolean;
}

export const PositionModal = ({
  editingPosition,
  onSubmit,
  loading = false,
}: PositionModalProps) => {
  const { isOpen, closeModal } = useModalStore();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editingPosition) {
        form.setFieldsValue({
          name: editingPosition.name,
        });
      } else {
        form.setFieldsValue({
          name: '',
        });
      }
    }
  }, [isOpen, editingPosition, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, editingPosition?.id);
      closeModal();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal
      title={editingPosition ? 'Lavozimni tahrirlash' : "Lavozim qo'shish"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={editingPosition ? 'Saqlash' : "Qo'shish"}
      cancelText="Bekor qilish"
      destroyOnHidden // destroyOnClose o'rniga
      width={500}
      afterClose={() => form.resetFields()}
      confirmLoading={loading}
    >
     
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="Lavozim nomi"
            name="name"
            rules={[
              { required: true, message: 'Lavozim nomini kiriting!' },
              {
                min: 2,
                message:
                  "Lavozim nomi kamida 2 ta belgidan iborat bo'lishi kerak!",
              },
              {
                max: 100,
                message: 'Lavozim nomi 100 ta belgidan oshmasligi kerak!',
              },
            ]}
          >
            <Input
              placeholder="Lavozim nomini kiriting"
              size="large"
              disabled={loading}
            />
          </Form.Item>
        </Form>
    </Modal>
  );
};
