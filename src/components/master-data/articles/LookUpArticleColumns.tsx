import { ColumnDef } from "@tanstack/react-table";
import ArticleType from "@/entities/Article";
import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";
import useArticleStore from "@/stores/article-store";
import { Checkbox } from "../../ui/checkbox";

const LookupArticleColumns: ColumnDef<ArticleType>[] = [
  {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const article = row.original;
      const { selectedArticle, setSelectedArticle } = useArticleStore();
      return (
        <Checkbox
          checked={selectedArticle === article}
          onCheckedChange={() => {
            setSelectedArticle(
              selectedArticle === article ? ({} as ArticleType) : article
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
    accessorKey: "articleid",
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
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "unitOfMeasure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit of Measure" />
    ),
  },
  {
    accessorKey: "vatid.vatid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VAT Rate" />
    ),
  },
];

export default LookupArticleColumns;
