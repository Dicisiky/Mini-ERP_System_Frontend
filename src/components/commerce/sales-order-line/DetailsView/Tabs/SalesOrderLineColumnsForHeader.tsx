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
import { SalesOrderState } from "@/entities/SalesOrder";
import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";
import { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "react-toastify";

const SalesOrderLineColumnsForHeader = (
  salesOrderId: string | undefined
): ColumnDef<FetchSalesOrderLineResponse>[] => [
  {
    accessorKey: "salesOrderLineId",
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
      const salesOrderLine = row.original;

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
                    salesOrderLine.salesOrderLineId!.toString()
                  )
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeIcon />
                <NavLink
                  to={`/sales-orders/${salesOrderLine.salesOrderId}/sales-order-lines/view/${salesOrderLine.salesOrderLineId}`}
                >
                  Sales order line details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  salesOrderLine.salesOrder.state !== SalesOrderState.NEW
                }
                className="flex items-center gap-2"
              >
                <PenIcon />
                <NavLink
                  to={`/sales-orders/${salesOrderLine.salesOrderId}/sales-order-lines/update/${salesOrderLine.salesOrderLineId}`}
                >
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  !(
                    salesOrderLine.salesOrder.state === SalesOrderState.NEW ||
                    salesOrderLine.salesOrder.state ===
                      SalesOrderState.DELIVERED ||
                    salesOrderLine.salesOrder.state ===
                      SalesOrderState.CANCELLED
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
              queryKeys={[
                ["sales-order-lines"],
                ["sales-orders"],
                ["sales-order"],
              ]}
              removeQueryKey={[
                "sales-order-line",
                `${salesOrderLine.salesOrderLineId}`,
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/sales-order-lines/delete/${salesOrderLine.salesOrderLineId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Sales order line
                    <span className="font-semibold">
                      {" "}
                      {salesOrderLine.salesOrderLineId}{" "}
                    </span>
                    from sales order
                    <span className="font-semibold"> {salesOrderId} </span>
                    was succesfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Sales order line
                    <span className="font-semibold">
                      {" "}
                      {salesOrderLine.salesOrderLineId}{" "}
                    </span>
                    from sales order
                    <span className="font-semibold"> {salesOrderId} </span>
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

export default SalesOrderLineColumnsForHeader;
