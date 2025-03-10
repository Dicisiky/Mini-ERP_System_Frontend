import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import { FetchRentLineResponse } from "@/entities/RentLine";
import useRentLineStore from "@/stores/rent-line-store";
import { Checkbox } from "@/components/ui/checkbox";

const LookupRentLineColumns: ColumnDef<FetchRentLineResponse>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const rentLine = row.original;
      const { selectedRentLine, setSelectedRentLine } = useRentLineStore();
      return (
        <Checkbox
          checked={selectedRentLine === rentLine}
          onCheckedChange={() => {
            setSelectedRentLine(
              selectedRentLine === rentLine ? null : rentLine
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
    accessorKey: "rentLineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "rentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rent" />
    ),
  },

  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "articleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article" />
    ),
  },
  {
    accessorKey: "pricePerDay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price per day" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.pricePerDay).toFixed(2)}`}</span>
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
    cell: ({ row }) => <span>{`${row.original.VatRate} %`}</span>,
  },
  {
    accessorKey: "lineAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line total" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.lineAmount).toFixed(2)}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "lineAmountWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with VAT" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.lineAmountWithVAT).toFixed(2)}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },

  {
    accessorKey: "penaltiesAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Penalties" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.penaltiesAmount).toFixed(2)}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "lineAmountWithPenalties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with penalties" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.lineAmountWithPenalties).toFixed(
        2
      )}`}</span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
];

export default LookupRentLineColumns;
