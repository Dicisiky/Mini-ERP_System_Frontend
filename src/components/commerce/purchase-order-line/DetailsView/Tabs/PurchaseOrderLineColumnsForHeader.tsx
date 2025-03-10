import { ColumnDef } from "@tanstack/react-table";
import {
  EyeIcon,
  FilesIcon,
  MoreVerticalIcon,
  PenIcon,
  TrashIcon,
} from "lucide-react";

import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseOrderState } from "@/entities/PurchaseOrder";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";
import { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "react-toastify";

const PurchaseOrderLineColumnsForHeader = (
  purchaseOrderId: string | undefined
): ColumnDef<FetchPurchaseOrderLineResponse>[] => [
  {
    accessorKey: "purchaseOrderLineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "articleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.price).toFixed(2)}`}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
  },
  {
    accessorKey: "vatRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VAT" />
    ),
    cell: ({ row }) => <span>{`${row.original.vatRate} %`}</span>,
  },
  {
    accessorKey: "totalLineAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line total" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.totalLineAmount).toFixed(2)}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "totalLineAmountWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with VAT" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.totalLineAmountWithVAT).toFixed(
        2
      )}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
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
                <EyeIcon />
                <NavLink
                  to={`/purchase-orders/${purchaseOrderLine.purchaseOrderId}/purchase-order-lines/view/${purchaseOrderLine.purchaseOrderLineId}`}
                >
                  Purchase order line details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  purchaseOrderLine.purchaseOrder.state !==
                  PurchaseOrderState.NEW
                }
                className="flex items-center gap-2"
              >
                <PenIcon />
                <NavLink
                  to={`/purchase-orders/${purchaseOrderLine.purchaseOrderId}/purchase-order-lines/update/${purchaseOrderLine.purchaseOrderLineId}`}
                >
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  !(
                    purchaseOrderLine.purchaseOrder.state ===
                      PurchaseOrderState.NEW ||
                    purchaseOrderLine.purchaseOrder.state ===
                      PurchaseOrderState.CONFIRMED ||
                    purchaseOrderLine.purchaseOrder.state ===
                      PurchaseOrderState.CANCELLED
                  )
                }
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
              removeQueryKey={[
                "purchase-order-line",
                `${purchaseOrderLine.purchaseOrderLineId}`,
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/purchase-order-lines/delete/${purchaseOrderLine.purchaseOrderLineId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Purchase order line
                    <span className="font-semibold">
                      {" "}
                      {purchaseOrderLine.purchaseOrderLineId}{" "}
                    </span>
                    from purchase order
                    <span className="font-semibold"> {purchaseOrderId} </span>
                    was successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Purchase order line
                    <span className="font-semibold">
                      {" "}
                      {purchaseOrderLine.purchaseOrderLineId}{" "}
                    </span>
                    from purchase order
                    <span className="font-semibold"> {purchaseOrderId} </span>
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

export default PurchaseOrderLineColumnsForHeader;
