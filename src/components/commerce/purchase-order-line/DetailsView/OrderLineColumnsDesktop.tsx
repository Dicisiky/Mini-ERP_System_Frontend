import { Column } from "@/components/partials/DetailGrid";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";

const PurchaseOrderLineViewDesktopColumns: Column<FetchPurchaseOrderLineResponse>[] =
  [
    { key: "purchaseOrderId", label: "Purchase order:" },
    { key: "quantity", label: "Quantity:" },
    { key: "purchaseOrderLineId", label: "Purchase order line:" },
    {
      key: "vatRate",
      label: "VAT rate:",
      formatFn: (vatRate) =>
        typeof vatRate === "number" ? `${vatRate} %` : "-",
    },
    { key: "purchaseOrderState", label: "Status:" },
    {
      key: "price",
      label: "Purchase price:",
      formatFn: (price) =>
        typeof price === "number" ? `$ ${price.toFixed(2)}` : "-",
    },
    { key: "supplierName", label: "Supplier:" },
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

export default PurchaseOrderLineViewDesktopColumns;
