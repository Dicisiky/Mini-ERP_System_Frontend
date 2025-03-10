import { Column } from "@/components/partials/DetailGrid";
import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import { format } from "date-fns";

const SalesOrderViewMobileColumns: Column<FetchSalesOrderResponse>[] = [
  { key: "salesOrderId", label: "Sales order:" },
  { key: "salesOrderStateDescription", label: "Status:" },
  { key: "customerName", label: "Customer name:" },
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

export default SalesOrderViewMobileColumns;
