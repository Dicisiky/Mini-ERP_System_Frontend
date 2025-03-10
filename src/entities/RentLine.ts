import ArticleType, { FetchArticleResponse } from "./Article";
import Rent, { FetchRentResponse } from "./Rent";

type RentLine = {
  rentLineId?: number;
  rent: Pick<Rent, "rentId">;
  article: Pick<ArticleType, "articleid">;
  quantity: number;
  pricePerDay: number;
  penaltiesAmount: number;
  lineAmount: number;
  lineAmountWithPenalties: number;
  lineAmountWithVAT: number;
};

export type FetchRentLineResponse = Omit<RentLine, "rent, article"> & {
  rent: FetchRentResponse;
  article: FetchArticleResponse;
  articleName?: string;
  VatRate?: number;
  rentId?: number;
  rentState?: string;
  customerName?: string;
  period?: number;
};

export default RentLine;
