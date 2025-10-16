import { useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const ToggleLanguage = () => {
  const [selectedLang, setSelectedLang] = useState('O‘zbekcha');

  const languages = [
    { code: 'uz', name: 'O‘zbekcha' },
    { code: 'uzk', name: 'Ўзбекча (Кирилл)' },
    { code: 'ru', name: 'Русский' },
  ];

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
  };

  const items: MenuProps['items'] = languages.map(lang => ({
    key: lang.code,
    label: (
      <div
        onClick={() => handleSelect(lang.name)}
        className={`rounded-md px-3 py-[10px] text-sm font-medium cursor-pointer select-none transition-colors duration-150
        ${
          selectedLang === lang.name
            ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-white/10'
        }`}
      >
        {lang.name}
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
    >
      <button
        className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200 text-sm outline-none"
        onClick={e => e.preventDefault()}
      >
        <span>{selectedLang}</span>
        <DownOutlined className="text-gray-500 dark:text-gray-400 text-[12px]" />
      </button>
    </Dropdown>
  );
};

export default ToggleLanguage;
