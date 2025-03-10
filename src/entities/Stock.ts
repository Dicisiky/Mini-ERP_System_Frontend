import { FetchArticleResponse } from "./Article";

type Stock = {
  stockId?: number;

  article: FetchArticleResponse;

  availableQuantity: number;

  incomingQuantity: number;

  rentedQuantity: number;

  technicalQuantity: number;

  returnedQuantity?: number;

  receivedQuantity?: number;

  soldQuantity?: number;

  canceledQuantity?: number;
};

export type NormalizedStock = Stock & {
  articleName: string;
  articleCategory: string;
};

export default Stock;
