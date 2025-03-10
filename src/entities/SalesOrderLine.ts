import { FetchSalesOrderResponse } from "./SalesOrder";
import { FetchArticleResponse } from "./Article";

type SalesOrderLine = {
  salesOrderLineId?: number;
  salesOrder: Pick<FetchSalesOrderResponse, "salesOrderId">;
  article: Pick<FetchArticleResponse, "articleid">;
  quantity: number;
  price: number;
  totalLineAmount: number;
  totalLineAmountWithVAT: number;
};

export type FetchSalesOrderLineResponse = Omit<SalesOrderLine, "articleId"> & {
  salesOrder?: FetchSalesOrderResponse;
  salesOrderState?: string;
  salesOrderId?: number;
  article?: FetchArticleResponse;
  articleName?: string;
  customerName?: string;
  vatRate?: number;
};

export default SalesOrderLine;
