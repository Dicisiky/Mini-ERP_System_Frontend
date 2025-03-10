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
import { DataTableColumnHeader } from "../../../partials/DataTable/DataTableHeaderColumn";
import { NavLink } from "react-router";
import DeleteDialog from "../../../partials/DeleteDialog";
import { useState } from "react";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";

const PurchaseOrdersLinesColumns: ColumnDef<FetchPurchaseOrderLineResponse>[] =
  [
    {
      accessorKey: "purchaseOrderLineId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Line id" />
      ),
      cell: ({ row }) => <span>{row.original.purchaseOrderLineId}</span>,
    },
    {
      accessorKey: "purchaseOrderId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order id" />
      ),
      cell: ({ row }) => <span>{row.original.purchaseOrderId}</span>,
    },
    {
      accessorKey: "articleName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Article" />
      ),
      cell: ({ row }) => <span>{row.original.articleName}</span>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => <span>{row.original.quantity}</span>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: "totalLineAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total amount" />
      ),
      cell: ({ row }) => (
        <span>${row.original.totalLineAmount.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "totalLineAmountWithVAT",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total amount (VAT)" />
      ),
      cell: ({ row }) => (
        <span>${row.original.totalLineAmountWithVAT.toFixed(2)}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [isDeleteOpen, setDeleteOpen] = useState(false);
        const purchaseOrderLine = row.original;
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
                    navigator.clipboard.writeText(
                      purchaseOrderLine.purchaseOrderLineId!.toString()
                    )
                  }
                >
                  <FilesIcon /> Copy to clipboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <PenIcon />
                  <NavLink
                    to={`/purchase-orders-lines/update/${purchaseOrderLine.purchaseOrderLineId}`}
                  >
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
                queryKeys={[["purchase-order-lines"], ["purchase-orders"]]}
                open={isDeleteOpen}
                setOpen={setDeleteOpen}
                endpoint={`/purchase-order-lines/delete/${purchaseOrderLine.purchaseOrderLineId}`}
              />
            )}
          </>
        );
      },
    },
  ];

export default PurchaseOrdersLinesColumns;
