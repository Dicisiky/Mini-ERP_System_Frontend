import { Column } from "@/components/partials/DetailGrid";
import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";

const SalesOrderLineViewMobileColumns: Column<FetchSalesOrderLineResponse>[] = [
  { key: "salesOrderId", label: "Sales order:" },

  { key: "salesOrderLineId", label: "Sales order line:" },
  { key: "salesOrderState", label: "Status:" },
  { key: "customerName", label: "Customer:" },
  { key: "articleName", label: "Article:" },
  { key: "quantity", label: "Quantity:" },
  {
    key: "vatRate",
    label: "Vat rate:",
    formatFn: (vatRate) => (typeof vatRate === "number" ? `${vatRate} %` : "-"),
  },
  {
    key: "price",
    label: "Sales price:",
    formatFn: (price) =>
      typeof price === "number" ? `$ ${price.toFixed(2)}` : "-",
  },
  {
    key: "totalLineAmount",
    label: "Total line amount:",
    formatFn: (totalPrice) =>
      typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
  },
  {
    key: "totalLineAmountWithVAT",
    label: "Total with VAT:",
    formatFn: (totalPrice) =>
      typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
  },
];

export default SalesOrderLineViewMobileColumns;
