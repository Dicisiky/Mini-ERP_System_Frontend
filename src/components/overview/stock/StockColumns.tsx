import { ColumnDef } from "@tanstack/react-table";
import { FilesIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";
import Stock from "@/entities/Stock";

const StockColumns: ColumnDef<Stock>[] = [
  {
    accessorKey: "stockId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "article.articleid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article id" />
    ),
  },
  {
    accessorKey: "articleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article name" />
    ),
  },
  {
    accessorKey: "articleCategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article category" />
    ),
  },
  {
    accessorKey: "availableQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
  },
  {
    accessorKey: "incomingQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Incoming" />
    ),
  },
  {
    accessorKey: "rentedQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rented" />
    ),
  },
  {
    accessorKey: "technicalQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Technical" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stock = row.original;

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() =>
                  navigator.clipboard.writeText(stock.stockId!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default StockColumns;
