import { ColumnDef } from "@tanstack/react-table";
import Penalty from "@/entities/Penalty";
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

const PenaltiesColumns: ColumnDef<Penalty>[] = [
  {
    accessorKey: "penaltyid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "penaltyTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Penalty type" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price: number = row.getValue("price");
      return `$ ${price.toFixed(2)}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const penalty = row.original;
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
                  navigator.clipboard.writeText(penalty.penaltyid!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/penalties/update/${penalty.penaltyid}`}>
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
              queryKey={["penalties"]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/penalties/${penalty.penaltyid}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Penalty{" "}
                    <span className="font-semibold">{penalty.description}</span>{" "}
                    was successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Penalty{" "}
                    <span className="font-semibold">{penalty.description}</span>{" "}
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

export default PenaltiesColumns;
