export interface Column<T> {
  key: keyof T;
  label: string;
  className?: string;
  formatFn?: (value: T[keyof T]) => string;
}

interface OrderHeaderProps<T> {
  columns: Column<T>[];
  data: T;
  className?: string;
}

const DetailGrid = <T extends Record<string, any>>({
  data,
  columns,
  className,
}: OrderHeaderProps<T>) => {
  if (!data) return null;

  return (
    <div className={`bg-white w-full shadow-sm ${className}`}>
      <div className="p-6 grid md:grid-cols-2">
        {columns.map(({ key, label, className, formatFn }) => (
          <div
            key={String(key)}
            className="max-w-md flex-col gap-2 py-2 border-b border-gray-200"
          >
            <div className="flex items-center justify-start">
              <p className="text-sm text-gray-700">{label}</p>
            </div>
            <div className="flex items-center justify-start">
              <p className={`font-medium text-gray-900 ${className}`}>
                {formatFn ? formatFn(data[key]) : data[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailGrid;
