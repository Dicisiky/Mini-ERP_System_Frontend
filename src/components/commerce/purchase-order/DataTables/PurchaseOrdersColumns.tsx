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
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PurchaseOrderColumns: ColumnDef<FetchPurchaseOrderResponse>[] = [
  {
    accessorKey: "purchaseOrderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <span>{row.original.purchaseOrderId}</span>,
  },
  {
    accessorKey: "purchaseOrderStateDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
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
      const purchaseOrder = row.original;

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
                    purchaseOrder.purchaseOrderId!.toString()
                  )
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeIcon />
                <NavLink
                  to={`/purchase-orders/view/${purchaseOrder.purchaseOrderId}`}
                >
                  View details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink
                  to={`/purchase-orders/update/${purchaseOrder.purchaseOrderId}`}
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
              queryKeys={[["purchase-orders"], ["purchase-order-lines"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/purchase-orders/${purchaseOrder.purchaseOrderId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Purchase Order
                    <span className="font-semibold">
                      {" "}
                      {purchaseOrder.purchaseOrderId}{" "}
                    </span>
                    was successfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Purchase Order
                    <span className="font-semibold">
                      {" "}
                      {purchaseOrder.purchaseOrderId}{" "}
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

export default PurchaseOrderColumns;
