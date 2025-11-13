import { BookOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";

interface BiographyProps {
  text?: string;
  fallback?: string;
}

const Biography: React.FC<BiographyProps> = ({ text, fallback = "—" }) => {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const shortLimit = 100;
  const fullLimit = 300;

  if (!text || text.trim() === "") {
    return <span className="text-gray-500">{fallback}</span>;
  }

  const needShort = text.length > shortLimit;
  const needFull = text.length > fullLimit;

  const displayText = expanded
    ? needFull
      ? text.slice(0, fullLimit)
      : text
    : text.slice(0, shortLimit);

  return (
    <>
      <div
        className="relative max-w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (!expanded && needShort) {
            setExpanded(true);
          } else if (needFull) {
            setModalOpen(true);
          }
        }}
      >
        <div
          className={`
            text-gray-700 text-sm leading-relaxed
            ${!expanded && needShort ? "pr-10" : ""}
            ${expanded ? "" : "line-clamp-3"}
          `}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <BookOutlined className="mr-1" />
          {displayText}
          {!expanded && needShort && "..."}
        </div>

        {!expanded && needShort && (
          <div
            className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-white pointer-events-none"
            style={{ marginRight: "-0.25rem" }}
          />
        )}

        {expanded && needFull && (
          <span className="ml-1 text-blue-600 font-medium">(to‘liq)</span>
        )}
      </div>

      <Modal
        title="To‘liq biografiya"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          <BookOutlined className="mr-1" />
          {text}
        </p>
      </Modal>
    </>
  );
};

export default Biography;