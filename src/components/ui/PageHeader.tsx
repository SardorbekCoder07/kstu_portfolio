import { Button, Input } from 'antd';
import { ReactNode } from 'react';

interface PageHeaderProps {
  count: number;
  countLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  buttonText: string;
  buttonIcon: ReactNode;
  onButtonClick: () => void;
}

export const PageHeader = ({
  count,
  countLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  buttonText,
  buttonIcon,
  onButtonClick,
}: PageHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Count section */}
        <div className="flex items-center">
          <label className="text-gray-700 font-medium text-sm sm:text-base whitespace-nowrap">
            {countLabel}: <span className="text-primary">{count}</span>
          </label>
        </div>

        {/* Search and Button section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-auto w-full">
          <Input
            placeholder={searchPlaceholder}
            type="text"
            className="w-full sm:w-64 lg:w-80"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            allowClear
          />
          <Button
            type="primary"
            icon={buttonIcon}
            onClick={onButtonClick}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <span className="hidden sm:inline">{buttonText}</span>
            <span className="sm:hidden">Qo'shish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
