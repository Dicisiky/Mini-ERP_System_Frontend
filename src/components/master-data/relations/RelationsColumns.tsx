import { ColumnDef } from "@tanstack/react-table";
import Relation from "@/entities/Relation";
import { TrashIcon, PenIcon, MoreVerticalIcon, FilesIcon } from "lucide-react";
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
import { NavLink } from "react-router-dom";
import DeleteDialog from "../../partials/DeleteDialog";
import { useState } from "react";
import { toast } from "react-toastify";

const RelationsColumns: ColumnDef<Relation>[] = [
  {
    accessorKey: "relationid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "relationTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Relation type" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phonenumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone number" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const relation = row.original;
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
                  relation.relationid &&
                  navigator.clipboard.writeText(relation.relationid.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/relations/update/${relation.relationid}`}>
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 hover:!text-destructive cursor-pointer"
                onClick={() => setDeleteOpen(true)}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isDeleteOpen && (
            <DeleteDialog
              queryKey={["relations"]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/relations/${relation.relationid}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Relation{" "}
                    <span className="font-semibold">{relation.name}</span> was
                    successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Relation{" "}
                    <span className="font-semibold">{relation.name}</span> could
                    not be deleted.
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

export default RelationsColumns;
