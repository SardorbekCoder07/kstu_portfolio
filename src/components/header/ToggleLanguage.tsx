import { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';

const ToggleLanguage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('O‘zbekcha');

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const languages = [
    { code: 'uz', name: 'O‘zbekcha' },
    { code: 'uzk', name: 'Ўзбекча (Кирилл)' },
    { code: 'ru', name: 'Русский' },
  ];

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    closeDropdown();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Toggle button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-300 font-medium text-theme-sm"
      >
        <span className="block mr-1">{selectedLang}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[12px] flex w-[180px] flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-700 dark:bg-gray-800"
      >
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.name)}
            className={`px-3 py-2 text-left text-theme-sm rounded-lg font-medium transition-colors ${
              selectedLang === lang.name
                ? 'bg-gray-100 text-gray-800 dark:bg-white/10'
                : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </Dropdown>
    </div>
  );
};

export default ToggleLanguage;
