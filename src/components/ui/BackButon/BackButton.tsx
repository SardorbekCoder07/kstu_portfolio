// src/components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        flex items-center gap-2 px-4 py-2 
        bg-gray-100 hover:bg-gray-200 
        text-gray-700 hover:text-gray-900 
        rounded-lg font-medium text-sm 
        transition-all duration-200 
        shadow-sm hover:shadow
      "
    >
      <LeftOutlined className="text-sm" />
      Orqaga
    </button>
  );
};

export default BackButton;