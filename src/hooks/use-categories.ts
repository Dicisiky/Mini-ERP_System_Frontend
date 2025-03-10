import Category from "@/entities/Category";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useCategories = () => {
  const apiClient = new ApiClient<Category>("/categories");

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await apiClient.getAll();
      } catch (error) {
        console.log(error);
        toast.error("Categories are not available.");
      }
    },
  });
};

export default useCategories;
