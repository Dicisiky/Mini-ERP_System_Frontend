import { ColumnDef } from "@tanstack/react-table";
import VatRateType from "@/entities/VatRate";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";
import useVatRateStore from "@/stores/vat-rate-store";
import { Checkbox } from "../../ui/checkbox";

const LookupVatRatesColumns: ColumnDef<VatRateType>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const category = row.original;
      const { selectedVatRate, setSelectedVatRate } = useVatRateStore();
      return (
        <Checkbox
          checked={selectedVatRate === category}
          onCheckedChange={() => {
            setSelectedVatRate(
              selectedVatRate === category ? ({} as VatRateType) : category
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
    accessorKey: "vatid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "percent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percent" />
    ),
    cell: ({ row }) => {
      const percent: number = row.getValue("percent");
      return <span>{percent} %</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId));
      return value.includes(filterValue);
    },
  },
];

export default LookupVatRatesColumns;
