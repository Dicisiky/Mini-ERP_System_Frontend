import { ColumnDef } from "@tanstack/react-table";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import { Checkbox } from "@/components/ui/checkbox";
import usePurchaseOrderStore from "@/stores/purchase-order-store";

const LookupPurchaseOrderColumns: ColumnDef<FetchPurchaseOrderResponse>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const purchaseOrder = row.original;
      const { selectedPurchaseOrder, setSelectedPurchaseOrder } =
        usePurchaseOrderStore();
      return (
        <Checkbox
          checked={
            selectedPurchaseOrder?.purchaseOrderId ===
            purchaseOrder.purchaseOrderId
          }
          onCheckedChange={() => {
            setSelectedPurchaseOrder(
              selectedPurchaseOrder?.purchaseOrderId ===
                purchaseOrder.purchaseOrderId
                ? null
                : purchaseOrder
            );
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "purchaseOrderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order id" />
    ),
  },
  {
    accessorKey: "purchaseOrderStateDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "supplierId.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
  },
  {
    accessorKey: "totalPriceWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price (with VAT)" />
    ),
  },
];

export default LookupPurchaseOrderColumns;
