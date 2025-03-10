import { FetchArticleResponse } from "@/entities/Article";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const useArticles = () => {
  const apiClient = new ApiClient<FetchArticleResponse>("/articles");
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();

        const result = response.map((article) => ({
          ...article,
          categoryName: article.categoryid.name,
        }));

        return result;
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useArticles;
