import { ColumnDef } from "@tanstack/react-table";
import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import useSalesOrderStore from "@/stores/sales-order-store";
import { Checkbox } from "@/components/ui/checkbox";

const LookupSalesOrderColumns: ColumnDef<FetchSalesOrderResponse>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const salesOrder = row.original;
      const { selectedSalesOrder, setSelectedSalesOrder } =
        useSalesOrderStore();
      return (
        <Checkbox
          checked={selectedSalesOrder?.salesOrderId === salesOrder.salesOrderId}
          onCheckedChange={() => {
            setSelectedSalesOrder(
              selectedSalesOrder?.salesOrderId === salesOrder.salesOrderId
                ? null
                : salesOrder
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
    accessorKey: "salesOrderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order id" />
    ),
  },
  {
    accessorKey: "salesOrderStateDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "customerId.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
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

export default LookupSalesOrderColumns;
