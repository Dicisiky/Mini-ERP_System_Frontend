import { Column } from "@/components/partials/DetailGrid";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import { format } from "date-fns";

const PurchaseOrderViewDesktopColumns: Column<FetchPurchaseOrderResponse>[] = [
  { key: "purchaseOrderId", label: "Purchase order:" },
  {
    key: "date",
    label: "Order date:",
    formatFn: (date) =>
      date ? format(new Date(date as string), "dd/MM/yyyy") : "-",
  },
  {
    key: "purchaseOrderStateDescription",
    label: "Status:",
  },

  {
    key: "totalPrice",
    label: "Total price:",
    formatFn: (totalPrice) =>
      typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
  },
  { key: "supplierName", label: "Supplier name:" },
  {
    key: "totalPriceWithVAT",
    label: "Total with VAT:",
    formatFn: (totalPriceWithVAT) =>
      typeof totalPriceWithVAT === "number"
        ? `$ ${totalPriceWithVAT.toFixed(2)}`
        : "-",
  },
];

export default PurchaseOrderViewDesktopColumns;
