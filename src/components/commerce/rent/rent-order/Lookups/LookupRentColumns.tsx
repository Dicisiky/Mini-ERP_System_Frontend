import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import { FetchRentResponse } from "@/entities/Rent";
import { format } from "date-fns";
import useRentStore from "@/stores/rent-store";
import { Checkbox } from "@/components/ui/checkbox";

const LookupRentColumns: ColumnDef<FetchRentResponse>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const rent = row.original;
      const { selectedRent, setSelectedRent } = useRentStore();
      return (
        <Checkbox
          checked={selectedRent === rent}
          onCheckedChange={() => {
            setSelectedRent(selectedRent === rent ? null : rent);
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "rentStateDescription",
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
    accessorKey: "period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rent period" />
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
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total price" />
    ),
  },
  {
    accessorKey: "totalPriceWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with VAT" />
    ),
  },
  {
    accessorKey: "totalPriceWithPenalties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with penalties" />
    ),
  },
];

export default LookupRentColumns;
