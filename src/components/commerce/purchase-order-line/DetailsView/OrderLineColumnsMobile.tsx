import { Column } from "@/components/partials/DetailGrid";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";

const PurchaseOrderLineViewMobileColumns: Column<FetchPurchaseOrderLineResponse>[] =
  [
    { key: "purchaseOrderId", label: "Purchase order:" },

    { key: "purchaseOrderLineId", label: "Purchase order line:" },
    { key: "purchaseOrderState", label: "Status:" },
    { key: "supplierName", label: "Supplier:" },
    { key: "articleName", label: "Product:" },
    { key: "quantity", label: "Quantity:" },
    {
      key: "vatRate",
      label: "VAT rate:",
      formatFn: (vatRate) =>
        typeof vatRate === "number" ? `${vatRate} %` : "-",
    },
    {
      key: "price",
      label: "Purchase price:",
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

export default PurchaseOrderLineViewMobileColumns;
