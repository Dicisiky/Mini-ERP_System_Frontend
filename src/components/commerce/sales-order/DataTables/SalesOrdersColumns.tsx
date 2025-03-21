import { ColumnDef } from "@tanstack/react-table";
import {
  TrashIcon,
  FilesIcon,
  MoreVerticalIcon,
  PenIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { format } from "date-fns";
import { toast } from "react-toastify";

const SalesOrderColumns: ColumnDef<FetchSalesOrderResponse>[] = [
  {
    accessorKey: "salesOrderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order id" />
    ),
    cell: ({ row }) => <span>{row.original.salesOrderId}</span>,
  },
  {
    accessorKey: "salesOrderStateDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order date" />
    ),
    cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price" />
    ),
    cell: ({ row }) => <span>${row.original.totalPrice.toFixed(2)}</span>,
  },
  {
    accessorKey: "totalPriceWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price (VAT)" />
    ),
    cell: ({ row }) => (
      <span>${row.original.totalPriceWithVAT.toFixed(2)}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const salesOrder = row.original;

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
                    salesOrder.salesOrderId!.toString()
                  )
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* ########## View order details action ############ */}
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeIcon />
                <NavLink to={`/sales-orders/view/${salesOrder.salesOrderId}`}>
                  View details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/sales-orders/update/${salesOrder.salesOrderId}`}>
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
              queryKeys={[["sales-orders"], ["sales-order-lines"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/sales-orders/${salesOrder.salesOrderId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Sales Order
                    <span className="font-semibold">
                      {" "}
                      {salesOrder.salesOrderId}{" "}
                    </span>
                    was successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Sales Order
                    <span className="font-semibold">
                      {" "}
                      {salesOrder.salesOrderId}{" "}
                    </span>
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

export default SalesOrderColumns;
