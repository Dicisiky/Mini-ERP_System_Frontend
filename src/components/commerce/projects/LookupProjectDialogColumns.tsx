import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../../partials/DataTable/DataTableHeaderColumn";

import { FetchProjectResponse } from "@/entities/Project";
import { format } from "date-fns";
import useProjectStore from "@/stores/project-store";
import { Checkbox } from "@/components/ui/checkbox";

const LookupProjectDialogColumns: ColumnDef<FetchProjectResponse>[] = [
    {
    id: "select",
    header: () => {
      return <span>Select</span>;
    },
    cell: ({ row }) => {
      const project = row.original;
      const { selectedProject, setSelectedProject } = useProjectStore();
      return (
        <Checkbox
          checked={selectedProject === project}
          onCheckedChange={() => {
            setSelectedProject(
              selectedProject === project ? ({} as FetchProjectResponse) : project
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
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <span>{row.original.projectId}</span>,
  },
  {
    accessorKey: "projectTypeDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project type" />
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
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
    accessorKey: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
    cell: ({ row }) => <span>${row.original.budget.toFixed(2)}</span>,
  },
  {
    accessorKey: "isInBudget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="In budget?" />
    ),
    cell: ({ row }) => <span>{row.original.isInBudget ? "Yes" : "No"}</span>,
  },
];

export default LookupProjectDialogColumns;
