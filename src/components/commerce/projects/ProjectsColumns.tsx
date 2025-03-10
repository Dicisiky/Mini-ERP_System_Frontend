import { ColumnDef } from "@tanstack/react-table";
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
import { FetchProjectResponse } from "@/entities/Project";
import { format } from "date-fns";

const ProjectColumns: ColumnDef<FetchProjectResponse>[] = [
  {
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <span>{row.original.projectId}</span>,
  },
  {
    accessorKey: "projectTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project type" />
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start date" />
    ),
    cell: ({ row }) => format(new Date(row.original.startDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End date" />
    ),
    cell: ({ row }) => format(new Date(row.original.endDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
    cell: ({ row }) => <span>${row.original.budget.toFixed(2)}</span>,
  },
  {
    accessorKey: "isInBudget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="In budget?" />
    ),
    cell: ({ row }) => <span>{row.original.isInBudget ? "Yes" : "No"}</span>,
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
                  navigator.clipboard.writeText(penalty.projectId!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/projects/update/${penalty.projectId}`}>
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
              queryKey={["projects"]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/projects/${penalty.projectId}`}
            />
          )}
        </>
      );
    },
  },
];

export default ProjectColumns;
