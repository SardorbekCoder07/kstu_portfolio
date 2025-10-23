// src/components/modals/CategoryModal.tsx
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { useEffect } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useModalStore } from '../../stores/useModalStore';

interface SubCategory {
  name: string;
}

interface CategoryFormValues {
  name: string;
  subCategories?: SubCategory[];
}

interface CategoryModalProps {
  editingCategory: {
    id: string;
    name: string;
    subCategories?: SubCategory[];
  } | null;
  onSubmit: (values: CategoryFormValues, id?: string) => void;
}

export const CategoryModal = ({
  editingCategory,
  onSubmit,
}: CategoryModalProps) => {
  const { isOpen, closeModal } = useModalStore();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        form.setFieldsValue({
          name: editingCategory.name,
          subCategories:
            editingCategory.subCategories &&
            editingCategory.subCategories.length > 0
              ? editingCategory.subCategories
              : [{ name: '' }],
        });
      } else {
        form.setFieldsValue({
          name: '',
          subCategories: [{ name: '' }],
        });
      }
    }
  }, [isOpen, editingCategory, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Bo'sh sub kategoriyalarni filtr qilish
      const filteredValues = {
        ...values,
        subCategories: values.subCategories
          ?.filter((sub: SubCategory) => sub.name && sub.name.trim() !== '')
          .map((sub: SubCategory) => ({ name: sub.name.trim() })),
      };

      onSubmit(filteredValues, editingCategory?.id);
      closeModal();
      message.success(
        editingCategory
          ? 'Kategoriya muvaffaqiyatli tahrirlandi'
          : "Kategoriya muvaffaqiyatli qo'shildi"
      );
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleAddSubCategory = (add: () => void) => {
    const subCategories = form.getFieldValue('subCategories') || [];
    const lastSubCategory = subCategories[subCategories.length - 1];

    // Oxirgi input to'ldirilganmi tekshirish
    if (
      lastSubCategory &&
      lastSubCategory.name &&
      lastSubCategory.name.trim() !== ''
    ) {
      add();
    } else {
      message.warning("Avval oxirgi sub kategoriyani to'ldiring!");
    }
  };

  return (
    <Modal
      title={
        editingCategory ? 'Kategoriyani tahrirlash' : "Kategoriya qo'shish"
      }
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={editingCategory ? 'Saqlash' : "Qo'shish"}
      cancelText="Bekor qilish"
      destroyOnHidden
      width={600}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="Kategoriya nomi"
          name="name"
          rules={[
            { required: true, message: 'Kategoriya nomini kiriting!' },
            {
              min: 2,
              message:
                "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak!",
            },
            {
              max: 50,
              message: 'Kategoriya nomi 50 ta belgidan oshmasligi kerak!',
            },
          ]}
        >
          <Input placeholder="Kategoriya nomini kiriting" size="large" />
        </Form.Item>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2">
            Sub kategoriyalar{' '}
            <span className="text-gray-400 font-normal">(ixtiyoriy)</span>
          </label>
        </div>

        <Form.List name="subCategories">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key} className="mb-3">
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      className="mb-0"
                      style={{ width: '100%' }}
                      rules={[
                        {
                          min: 2,
                          message: "Kamida 2 ta belgi bo'lishi kerak!",
                        },
                        {
                          max: 50,
                          message: 'Maksimal 50 ta belgi!',
                        },
                      ]}
                    >
                      <Input
                        placeholder={`Sub kategoriya ${index + 1}`}
                        size="large"
                      />
                    </Form.Item>

                    {index === fields.length - 1 ? (
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => handleAddSubCategory(add)}
                      />
                    ) : (
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        size="large"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Space.Compact>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
