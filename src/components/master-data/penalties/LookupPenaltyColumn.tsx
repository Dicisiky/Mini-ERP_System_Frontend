import Penalty from "@/entities/Penalty";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import usePenaltyStore from "@/stores/penalty-store";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";

const LookupPenaltyColumns: ColumnDef<Penalty>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const penalty = row.original;
      const { selectedPenalty, setSelectedPenalty } = usePenaltyStore();
      return (
        <Checkbox
          checked={selectedPenalty === penalty}
          onCheckedChange={() => {
            setSelectedPenalty(selectedPenalty === penalty ? null : penalty);
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "penaltyid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "penaltyTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Penalty type" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price: number = row.getValue("price");
      return `$ ${price.toFixed(2)}`;
    },
  },
];

export default LookupPenaltyColumns;
