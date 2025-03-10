import { ColumnDef } from "@tanstack/react-table";
import Relation from "@/entities/Relation";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";
import useRelationStore from "@/stores/relation-store";
import { Checkbox } from "../../ui/checkbox";

const LookupCustomerColumns: ColumnDef<Relation>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const relation = row.original;
      const { selectedRelation, setSelectedRelation } = useRelationStore();
      return (
        <Checkbox
          checked={selectedRelation === relation}
          onCheckedChange={() => {
            setSelectedRelation(
              selectedRelation === relation ? ({} as Relation) : relation
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
    accessorKey: "relationid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "relationTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Relation type" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phonenumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone number" />
    ),
  },
];

export default LookupCustomerColumns;
