import { ColumnDef } from "@tanstack/react-table";
import {
  TrashIcon,
  FilesIcon,
  MoreVerticalIcon,
  PenIcon,
  EyeIcon,
} from "lucide-react"; // Importul TrashIcon

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/partials/DataTable/DataTableHeaderColumn";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { FetchRentLineResponse } from "@/entities/RentLine";
import { toast } from "react-toastify";
import { RentState } from "@/entities/Rent";

const RentLineColumns: ColumnDef<FetchRentLineResponse>[] = [
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
    accessorKey: "rentState",
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
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const rentLine = row.original;

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() =>
                  navigator.clipboard.writeText(rentLine.rentLineId!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeIcon />
                <NavLink to={`/rent-lines/view/${1}`}>
                  Rent line details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={rentLine.rent.state !== RentState.NEW}
                className="flex items-center gap-2"
              >
                <PenIcon />
                <NavLink to={`/rent-lines/update/${rentLine.rentLineId}`}>
                  Edit
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  !(
                    rentLine.rent.state === RentState.NEW ||
                    rentLine.rent.state === RentState.RETURNED ||
                    rentLine.rent.state === RentState.CANCELLED
                  )
                }
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2 hover:!text-destructive cursor-pointer"
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isDeleteOpen && (
            <DeleteDialog
              queryKeys={[
                ["rent-lines"],
                ["rents"],
                ["applied-penalties"],
                ["rent-order-lines"],
                ["rent-applied-penalties"],
              ]}
              removeQueryKey={["rent", rentLine.rentId]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/rentlines/delete/${rentLine.rentLineId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Rent line{" "}
                    <span className="font-semibold">
                      {rentLine.rentLineId}{" "}
                    </span>
                    from rent order
                    <span className="font-semibold"> {rentLine.rentId} </span>
                    was succesfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.success(
                  <span>
                    Rent line
                    <span className="font-semibold">
                      {" "}
                      {rentLine.rentLineId}{" "}
                    </span>
                    from rent order
                    <span className="font-semibold"> {rentLine.rentId} </span>
                    could not be deleted.
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

export default RentLineColumns;
