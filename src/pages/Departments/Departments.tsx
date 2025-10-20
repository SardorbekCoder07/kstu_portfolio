import { PageHeader } from '../../components/ui/PageHeader';
import { PlusOutlined } from '@ant-design/icons';
import { FacultyTable } from '../Faculties/FacultyTable';
import { useState } from 'react';
import { DepartmentModal } from './DepartmentModal';

const Departments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [fileList, setFileList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const faculties = [
    { id: 1, name: 'Axborot texnologiyalari fakulteti' },
    { id: 2, name: 'Gumanitar fanlar fakulteti' },
    { id: 3, name: 'Iqtisodiyot fakulteti' },
  ];

  const draggerProps = {
    name: 'file',
    multiple: false,
    beforeUpload: () => false,
    fileList,
    onChange: (info: any) => setFileList(info.fileList),
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log({
        departmentName,
        selectedFacultyId,
        fileList,
      });
      setIsSaving(false);
      setIsModalOpen(false);
      setDepartmentName('');
      setSelectedFacultyId(null);
      setFileList([]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        count={0}
        countLabel="Kafedralar soni"
        searchPlaceholder="Kafedrani qidirish..."
        searchValue={''}
        onSearchChange={() => {}}
        buttonText="Kafedra qo'shish"
        buttonIcon={<PlusOutlined />}
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* Fake Table */}
      <FacultyTable
        faculties={[]}
        isLoading={false}
        onEdit={() => {}}
        onDelete={() => {}}
        deletingId={null}
        isDeleting={false}
      />

      {/* Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        departmentName={departmentName}
        onDepartmentNameChange={setDepartmentName}
        selectedFacultyId={selectedFacultyId}
        onFacultySelect={setSelectedFacultyId}
        faculties={faculties}
        editingDepartment={null}
        fileList={fileList}
        draggerProps={draggerProps}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Departments;
