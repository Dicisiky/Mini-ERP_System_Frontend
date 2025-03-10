import { ColumnDef } from "@tanstack/react-table";
import VatRateType from "@/entities/VatRate";
import { TrashIcon, FilesIcon, MoreVerticalIcon, PenIcon } from "lucide-react"; // Importul TrashIcon

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
import { NavLink } from "react-router";
import DeleteDialog from "../../partials/DeleteDialog";
import { useState } from "react";
import { toast } from "react-toastify";

const VatRatesColumns: ColumnDef<VatRateType>[] = [
  {
    accessorKey: "vatid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "percent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percent" />
    ),
    cell: ({ row }) => {
      const percent: number = row.getValue("percent");
      return <span>{percent} %</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId));
      return value.includes(filterValue);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const vatrate = row.original;

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
                  navigator.clipboard.writeText(vatrate.vatid!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/vat-rates/update/${vatrate.vatid}`}>
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2 hover:!text-destructive cursor-pointer"
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isDeleteOpen && (
            <DeleteDialog
              queryKey={["vat-rates"]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/vatrates/${vatrate.vatid}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Vat rate{" "}
                    <span className="font-semibold">{vatrate.percent} %</span>{" "}
                    was successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Vat rate{" "}
                    <span className="font-semibold">{vatrate.percent} %</span>{" "}
                    could not be deleted.
                  </span>
                )
              }
            />
          )}
        </>
      );
    },
  },
];

export default VatRatesColumns;
