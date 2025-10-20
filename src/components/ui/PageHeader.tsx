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
    <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 w-1/2">
        <label className="text-gray-700 font-medium whitespace-nowrap">
          {countLabel}: {count}
        </label>
      </div>
      <div className="flex items-center gap-3 w-1/2">
        <Input
          placeholder={searchPlaceholder}
          type="text"
          className="w-full"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
        />
        <Button type="primary" icon={buttonIcon} onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
