import React from "react";
import { Spin, Pagination, Empty } from "antd";

interface TabContentProps<T> {
  loading: boolean;
  data: T[];
  total: number;
  page: number;
  setPage: (page: number) => void;
  render: (items: T[]) => React.ReactNode;
}

export function TabContent<T>({
  loading,
  data,
  total,
  page,
  setPage,
  render,
}: TabContentProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  }

  if (!data?.length) {
    return <Empty description="Ma’lumot mavjud emas" />;
  }

  return (
    <>
      {render(data)}

      {total > 5 && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={page}
            pageSize={5}
            total={total}
            onChange={setPage}
          />
        </div>
      )}
    </>
  );
}
