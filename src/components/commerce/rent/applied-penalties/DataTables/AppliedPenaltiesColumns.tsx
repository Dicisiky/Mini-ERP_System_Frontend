import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { Button } from "@/components/ui/button";
import { FetchAppliedPenalty } from "@/entities/AppliedPenalty";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, FilesIcon, PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "react-toastify";

// ############# Columns for view tables (they will receive objects of FetchAppliedPenalty type)
const AppliedPenaltiesColumns: ColumnDef<FetchAppliedPenalty>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "rentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rent id" />
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "rentLineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line id" />
    ),
  },
  {
    accessorKey: "articleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Article" />
    ),
  },
  {
    accessorKey: "penaltyDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied for" />
    ),
  },
  {
    accessorKey: "penaltyAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const penalty = row.original;
      return <span>{`$ ${Number(penalty.penaltyAmount).toFixed(2)}`}</span>;
    },
  },
  // ############# Show actions menu ( '...' from the last column in a table) #############
  {
    id: "actions",
    cell: ({ row }) => {
      // ############# the state of the confirm delete dialog (visible/not visible) #############
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      // ############# the object that lives in a table row #############
      const appliedPenalty = row.original;

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="left">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/* ############# Action 'Copy to clipboard ############# */}
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() =>
                  navigator.clipboard.writeText(appliedPenalty.id!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>

              {/* ########### Separator (a line between actions) ########### */}
              <DropdownMenuSeparator />

              {/* ############# Action 'Edit' a row ############# */}
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/applied-penalties/update/${appliedPenalty.id}`}>
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* ############# Action 'Delete' a row ############# */}
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2 hover:!text-destructive cursor-pointer"
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/*   ############# Delete dialog element #############  */}
          {isDeleteOpen && (
            <DeleteDialog
              queryKeys={[
                ["rents"],
                ["rent-lines"],
                ["applied-penalties"],
                ["rent-order-lines", `${appliedPenalty.rentLine.rentLineId}`],
                [
                  "rent-applied-penalties",
                  `${appliedPenalty.rentLine.rentLineId}`,
                ],
                ["rent", `${appliedPenalty.rentLine.rentId}`],
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/applied-penalties/delete/${appliedPenalty.id}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Applied penalty{" "}
                    <span className="font-semibold"> {appliedPenalty.id} </span>{" "}
                    was successfully removed from rent line{" "}
                    <span className="font-semibold">
                      {" "}
                      {appliedPenalty.rentLine.rentLineId}{" "}
                    </span>
                    !
                  </span>
                )
              }
              onError={() =>
                toast.error(
                  <span>
                    Applied penalty{" "}
                    <span className="font-semibold"> {appliedPenalty.id} </span>{" "}
                    could not be removed from rent line{" "}
                    <span className="font-semibold">
                      {" "}
                      {appliedPenalty.rentLine.rentLineId}{" "}
                    </span>
                    !
                  </span>
                )
              }
            />
          )}
        </>
      );
    },
  },
];

export default AppliedPenaltiesColumns;
