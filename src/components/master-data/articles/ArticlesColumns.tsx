import { ColumnDef } from "@tanstack/react-table";
import { FetchArticleResponse } from "@/entities/Article";
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
import VatRateType from "@/entities/VatRate";
import { toast } from "react-toastify";

const ArticleColumns: ColumnDef<FetchArticleResponse>[] = [
  {
    accessorKey: "articleid",
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
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
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
    accessorKey: "unitOfMeasure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UM" />
    ),
  },
  {
    accessorKey: "vatid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VAT rate" />
    ),
    cell: ({ row }) => {
      const vat: VatRateType = row.getValue("vatid");
      return `${vat?.percent || 0} %`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const article = row.original;
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
                  article.articleid &&
                  navigator.clipboard.writeText(article.articleid.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/articles/update/${article.articleid}`}>
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
              queryKeys={[["stocks"], ["articles"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/articles/${article.articleid}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Article{" "}
                    <span className="font-semibold">{article.name}</span> was
                    successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Article{" "}
                    <span className="font-semibold">{article.name}</span> could
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

export default ArticleColumns;
