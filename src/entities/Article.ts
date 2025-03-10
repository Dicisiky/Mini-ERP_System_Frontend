import UMTypes from "./UMTypes";
import Category from "./Category";
import VatRateType from "./VatRate";

type ArticleType = {
  articleid?: number;
  name: string;
  description: string;
  price: number;
  um: UMTypes;
  categoryid: Pick<Category, "categoryid">;
  vatid: Pick<VatRateType, "vatid">;
};

export type FetchArticleResponse = Omit<ArticleType, "categoryid" | "vatid"> & {
  categoryid: Category;
  categoryName: string;
  vatid: VatRateType;
  unitOfMeasure: string;
};

export default ArticleType;
