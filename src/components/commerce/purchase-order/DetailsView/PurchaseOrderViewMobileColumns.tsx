import { Column } from "@/components/partials/DetailGrid";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import { format } from "date-fns";

const PurchaseOrderViewMobileColumns: Column<FetchPurchaseOrderResponse>[] = [
  { key: "purchaseOrderId", label: "Purchase order:" },
  { key: "purchaseOrderStateDescription", label: "Status:" },
  { key: "supplierName", label: "Supplier name:" },
  {
    key: "date",
    label: "Order date:",
    formatFn: (date) =>
      date ? format(new Date(date as string), "dd/MM/yyyy") : "-",
  },
  {
    key: "totalPrice",
    label: "Total price:",
    formatFn: (totalPrice) =>
      typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
  },
  {
    key: "totalPriceWithVAT",
    label: "Total with VAT:",
    formatFn: (totalPriceWithVAT) =>
      typeof totalPriceWithVAT === "number"
        ? `$ ${totalPriceWithVAT.toFixed(2)}`
        : "-",
  },
];

export default PurchaseOrderViewMobileColumns;
