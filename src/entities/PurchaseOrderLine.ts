import { FetchPurchaseOrderResponse } from "./PurchaseOrder";
import { FetchArticleResponse } from "./Article";

type PurchaseOrderLine = {
  purchaseOrderLineId?: number;
  purchaseOrder: Pick<FetchPurchaseOrderResponse, "purchaseOrderId">;
  article: Pick<FetchArticleResponse, "articleid">;
  quantity: number;
  price: number;
  totalLineAmount: number;
  totalLineAmountWithVAT: number;
};

export type FetchPurchaseOrderLineResponse = Omit<
  PurchaseOrderLine,
  "articleId"
> & {
  purchaseOrder?: FetchPurchaseOrderResponse;
  purchaseOrderState?: string
  purchaseOrderId?: number;
  article?: FetchArticleResponse;
  articleName?: string;
  supplierName?: string;
  vatRate?: number;
};

export default PurchaseOrderLine;
