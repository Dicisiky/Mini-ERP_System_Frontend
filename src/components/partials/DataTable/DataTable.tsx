import {
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTableProps from "@/entities/DataTableProps";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { SearchIcon } from "lucide-react";
import EnumDescription from "@/entities/EnumDescription";
import { useState } from "react";

// use filter text when searching for a colummn value that containts the text
// use filter enum when searching for a specific enum value
interface ExtendedDataTableProps<TData, TValue>
  extends DataTableProps<TData, TValue> {
  filterTextColumns?: string[];
  filterTextPlaceholders?: string[];
  filterEnumColumns?: string[];
  filterEnumPlaceholders?: string[];
  enums?: EnumDescription[] | any[];
  rowSelection?: any;
  setRowSelection?: (object: any) => void;
}

function DataTable<TData, TValue>({
  columns,
  data,
  filterTextColumns,
  filterTextPlaceholders,
  filterEnumColumns,
  filterEnumPlaceholders,
  enums,
  rowSelection,
  setRowSelection,
}: ExtendedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});
  const [selectedEnumValues, setSelectedEnumValues] = useState<
    Record<string, string>
  >({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Clear all filters
  const handleClearFilter = () => {
    setSearchTexts({});
    setSelectedEnumValues({});
    filterTextColumns &&
      filterTextColumns.forEach((col) => {
        table.getColumn(col)?.setFilterValue(undefined);
      });
    filterEnumColumns &&
      filterEnumColumns.forEach((col) => {
        table.getColumn(col)?.setFilterValue(undefined);
      });
  };

  const filterLayoutCondition =
    (filterTextColumns && filterEnumColumns) ||
    (filterTextColumns && filterTextColumns.length > 1) ||
    (filterEnumColumns && filterEnumColumns.length > 1);

  const filterTextColumnsCondiiton =
    filterTextColumns &&
    filterTextColumns.length > 0 &&
    filterTextPlaceholders &&
    filterTextPlaceholders.length > 0;

  const filterEnumColumnsCondition =
    filterEnumColumns &&
    filterEnumColumns.length > 0 &&
    enums &&
    enums.length > 0 &&
    filterEnumPlaceholders &&
    filterEnumPlaceholders.length > 0;

  const showFilters = filterEnumColumns || filterTextColumns;

  const showButtonCondition = filterTextColumns || filterEnumColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection: rowSelection ? rowSelection : "",
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: () => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    },
  });

  return (
    <div>
      {showFilters && (
        <div
          className={`flex flex-col md:flex-row items-center gap-4 py-4 ${
            filterLayoutCondition ? "max-w-3xl" : "max-w-sm"
          }`}
        >
          {filterTextColumnsCondiiton &&
            filterTextColumns.map((column, index) => (
              <div
                key={column}
                className="flex-1 relative max-w-sm mb-4 md:mb-0"
              >
                <span className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-800 h-4" />
                </span>
                <Input
                  placeholder={filterTextPlaceholders[index]}
                  value={searchTexts[column] || ""}
                  onChange={(event) => {
                    const newSearchTexts = {
                      ...searchTexts,
                      [column]: event.target.value,
                    };
                    setSearchTexts(newSearchTexts);
                    table.getColumn(column)?.setFilterValue(event.target.value);
                  }}
                  className="px-10 w-full max-w-sm"
                />
              </div>
            ))}
          {filterEnumColumnsCondition && (
            <div className="flex flex-1 items-center gap-4">
              {filterEnumColumns.map((column, index) => (
                <Select
                  key={column}
                  onValueChange={(value) => {
                    const newSelectedEnumValues = {
                      ...selectedEnumValues,
                      [column]: value,
                    };
                    setSelectedEnumValues(newSelectedEnumValues);
                    table
                      .getColumn(column)
                      ?.setFilterValue(value === "all" ? undefined : value);
                  }}
                  value={selectedEnumValues[column] || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filterEnumPlaceholders[index]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {enums.map(({ value, label }) => (
                      <SelectItem key={value} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
          {showButtonCondition && (
            <Button
              disabled={
                !(
                  Object.keys(selectedEnumValues).length ||
                  Object.keys(searchTexts).length
                )
              }
              onClick={handleClearFilter}
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table className="bg-white shadow">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        table={table}
      />
    </div>
  );
}

export default DataTable;
