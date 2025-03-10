import { Column } from "@/components/partials/DetailGrid";
import { FetchRentResponse } from "@/entities/Rent";
import { format } from "date-fns";

const RentViewDesktopColumns: Column<FetchRentResponse>[] = [
  { key: "rentId", label: "Rent order:" },
  {
    key: "period",
    label: "Rent period:",
    formatFn: (period) => `${period} days`,
  },
  { key: "rentStateDescription", label: "Status:" },

  {
    key: "totalPrice",
    label: "Total price:",
    formatFn: (totalPrice) =>
      typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
  },
  { key: "customerName", label: "Customer name:" },
  {
    key: "totalPriceWithVAT",
    label: "Total with VAT:",
    formatFn: (totalPriceWithVAT) =>
      typeof totalPriceWithVAT === "number"
        ? `$ ${totalPriceWithVAT.toFixed(2)}`
        : "-",
  },
  {
    key: "startDate",
    label: "Start date:",
    formatFn: (startDate) =>
      startDate ? format(new Date(startDate as string), "dd/MM/yyyy") : "-",
  },

  {
    key: "totalPriceWithPenalties",
    label: "Total with penalties:",
    formatFn: (totalPriceWithPenalties) =>
      typeof totalPriceWithPenalties === "number"
        ? `$ ${totalPriceWithPenalties.toFixed(2)}`
        : "-",
    className: "!text-red-500",
  },
  {
    key: "endDate",
    label: "End date:",
    formatFn: (endDate) =>
      endDate ? format(new Date(endDate as string), "dd/MM/yyyy") : "-",
  },
];

export default RentViewDesktopColumns;
