import { Column } from "@/components/partials/DetailGrid";
import { FetchRentLineResponse } from "@/entities/RentLine";

const RentLineViewMobileColumns: Column<FetchRentLineResponse>[] = [
  { key: "rentId", label: "Rent order:" },
  { key: "rentLineId", label: "Rent line:" },
  { key: "customerName", label: "Customer name:" },
  {
    key: "articleName",
    label: "Article:",
  },
  { key: "quantity", label: "Quantity:" },
  {
    key: "period",
    label: "Rent period",
    formatFn: (period) => (typeof period === "number" ? `${period} days` : "-"),
  },
  {
    key: "pricePerDay",
    label: "Price per day:",
    formatFn: (pricePerDay) =>
      typeof pricePerDay === "number" ? `$ ${pricePerDay.toFixed(2)}` : "-",
  },
  {
    key: "VatRate",
    label: "VAT rate:",
    formatFn: (VatRate) => (typeof VatRate === "number" ? `${VatRate} %` : "-"),
  },
  {
    key: "lineAmount",
    label: "Line total:",
    formatFn: (lineAmount) =>
      typeof lineAmount === "number" ? `$ ${lineAmount.toFixed(2)}` : "-",
  },
  {
    key: "lineAmountWithVAT",
    label: "Total with VAT:",
    formatFn: (lineAmountWithVAT) =>
      typeof lineAmountWithVAT === "number"
        ? `$ ${lineAmountWithVAT.toFixed(2)}`
        : "-",
  },
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

export default RentLineViewMobileColumns;
