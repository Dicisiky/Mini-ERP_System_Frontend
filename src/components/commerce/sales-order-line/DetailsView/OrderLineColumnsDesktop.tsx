import { Column } from "@/components/partials/DetailGrid";
import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";

const SalesOrderLineViewDesktopColumns: Column<FetchSalesOrderLineResponse>[] =
  [
    { key: "salesOrderId", label: "Sales order:" },
    { key: "quantity", label: "Quantity:" },
    { key: "salesOrderLineId", label: "Sales order line:" },
    {
      key: "vatRate",
      label: "Vat rate:",
      formatFn: (vatRate) =>
        typeof vatRate === "number" ? `${vatRate} %` : "-",
    },
    { key: "salesOrderState", label: "Status:" },
    {
      key: "price",
      label: "Sales price:",
      formatFn: (price) =>
        typeof price === "number" ? `$ ${price.toFixed(2)}` : "-",
    },
    { key: "customerName", label: "Customer:" },
    {
      key: "totalLineAmount",
      label: "Total line amount:",
      formatFn: (totalPrice) =>
        typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
    },
    { key: "articleName", label: "Article:" },
    {
      key: "totalLineAmountWithVAT",
      label: "Total with VAT:",
      formatFn: (totalPrice) =>
        typeof totalPrice === "number" ? `$ ${totalPrice.toFixed(2)}` : "-",
    },
  ];

export default SalesOrderLineViewDesktopColumns;
