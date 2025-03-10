import { Column } from "@/components/partials/DetailGrid";
import { FetchRentLineResponse } from "@/entities/RentLine";

const RentLineViewDesktopColumns: Column<FetchRentLineResponse>[] = [
  { key: "rentId", label: "Rent order:" },
  {
    key: "period",
    label: "Rent period",
    formatFn: (period) => (typeof period === "number" ? `${period} days` : "-"),
  },

  { key: "rentState", label: "Rent status:" },
  {
    key: "pricePerDay",
    label: "Price per day:",
    formatFn: (pricePerDay) =>
      typeof pricePerDay === "number" ? `$ ${pricePerDay.toFixed(2)}` : "-",
  },

  { key: "rentLineId", label: "Rent line:" },
  {
    key: "VatRate",
    label: "VAT rate:",
    formatFn: (VatRate) => (typeof VatRate === "number" ? `${VatRate} %` : "-"),
  },
  { key: "customerName", label: "Customer name:" },
  {
    key: "lineAmount",
    label: "Line total:",
    formatFn: (lineAmount) =>
      typeof lineAmount === "number" ? `$ ${lineAmount.toFixed(2)}` : "-",
  },
  {
    key: "articleName",
    label: "Article:",
  },

  {
    key: "lineAmountWithVAT",
    label: "Total with VAT:",
    formatFn: (lineAmountWithVAT) =>
      typeof lineAmountWithVAT === "number"
        ? `$ ${lineAmountWithVAT.toFixed(2)}`
        : "-",
  },
  { key: "quantity", label: "Quantity:" },

  {
    key: "lineAmountWithPenalties",
    label: "Total with penalties:",
    formatFn: (lineAmountWithPenalties) =>
      typeof lineAmountWithPenalties === "number"
        ? `$ ${lineAmountWithPenalties.toFixed(2)}`
        : "-",
    className: "!text-red-500",
  },
];

export default RentLineViewDesktopColumns;
