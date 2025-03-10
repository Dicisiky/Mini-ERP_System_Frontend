import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon, FilesIcon, MoreVerticalIcon, PenIcon } from "lucide-react";
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
import Category from "@/entities/Category";
import { toast } from "react-toastify";

const CategoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "categoryid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const category = row.original;
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
                  category.categoryid &&
                  navigator.clipboard.writeText(category.categoryid.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/categories/update/${category.categoryid}`}>
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
              queryKey={["categories"]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/categories/${category.categoryid}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Category{" "}
                    <span className="font-semibold">{category.name}</span> was
                    successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Category{" "}
                    <span className="font-semibold">{category.name}</span> could
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

export default CategoryColumns;
