import Article, { FetchArticleResponse } from "@/entities/Article";
import { create } from "zustand";

interface ArticleStore {
  articles: Article[];
  selectedArticle: FetchArticleResponse | null;
  setArticle: (articles: Article[]) => void;
  setSelectedArticle: (article: FetchArticleResponse | null) => void;
  clearSelectedArticle: () => void;
}

const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  selectedArticle: null,
  setArticle: (articles) => set({ articles }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
  clearSelectedArticle: () => set({ selectedArticle: null }),
}));

export default useArticleStore;
