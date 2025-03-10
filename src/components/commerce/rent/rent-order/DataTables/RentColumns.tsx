import { ColumnDef } from "@tanstack/react-table";
import {
  TrashIcon,
  FilesIcon,
  MoreVerticalIcon,
  PenIcon,
  EyeIcon,
} from "lucide-react";

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
import { FetchRentResponse, RentState } from "@/entities/Rent";
import DeleteDialog from "@/components/partials/DeleteDialog";
import { format } from "date-fns";
import { toast } from "react-toastify";

const RentColumns: ColumnDef<FetchRentResponse>[] = [
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
      <DataTableColumnHeader column={column} title="Days" />
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
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.totalPrice).toFixed(2)}`}</span>
    ),
  },
  {
    accessorKey: "totalPriceWithVAT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with VAT" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.totalPriceWithVAT).toFixed(2)}`}</span>
    ),
  },
  {
    accessorKey: "totalPriceWithPenalties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total with penalties" />
    ),
    cell: ({ row }) => (
      <span>{`$ ${Number(row.original.totalPriceWithPenalties).toFixed(
        2
      )}`}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      const rent = row.original;

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
                  navigator.clipboard.writeText(rent.rentId!.toString())
                }
              >
                <FilesIcon /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* ########## View order details action ############ */}
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeIcon />
                <NavLink to={`/rents/view/${rent.rentId}`}>
                  Rent details
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <PenIcon />
                <NavLink to={`/rents/update/${rent.rentId}`}>Edit</NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  !(
                    rent.state === RentState.NEW ||
                    rent.state === RentState.RETURNED ||
                    rent.state === RentState.CANCELLED
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
                ["rents-new"],
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              endpoint={`/rents/delete/${rent.rentId}`}
              onSuccess={() =>
                toast.success(
                  <span>
                    Rent
                    <span className="font-semibold"> {rent.rentId} </span>
                    was succesfully deleted.
                  </span>
                )
              }
              onError={() =>
                toast.success(
                  <span>
                    Rent
                    <span className="font-semibold"> {rent.rentId} </span>
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

export default RentColumns;
