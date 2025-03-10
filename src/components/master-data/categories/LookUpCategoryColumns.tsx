import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";
import Category from "@/entities/Category";
import { Checkbox } from "@/components/ui/checkbox";
import useCategoryStore from "@/stores/category-store";

const LookupCategoryColumns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const category = row.original;
      const { selectedCategory, setSelectedCategory } = useCategoryStore();
      return (
        <Checkbox
          checked={selectedCategory === category}
          onCheckedChange={() => {
            setSelectedCategory(
              selectedCategory === category ? ({} as Category) : category
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
    accessorKey: "categoryid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
];

export default LookupCategoryColumns;
