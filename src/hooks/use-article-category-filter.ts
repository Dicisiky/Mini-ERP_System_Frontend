import EnumDescription from "@/entities/EnumDescription";
import { useState, useEffect } from "react";
import useCategories from "./use-categories";

const useArticleCategoryFilter = () => {
  const { data: categories } = useCategories();
  const [categoriesEnum, setCategoriesEnum] = useState<EnumDescription[]>([]);

  // ########## categories fetched have the shape of Category object ##########
  // ########## we want them in the shape of EnumDescription to be used in data filterting ##########

  useEffect(() => {
    if (categories)
      setCategoriesEnum(
        categories?.map((c) => ({
          value: c.name,
          label: c.name,
        }))
      );
  }, [categories]);

  return categoriesEnum;
};
export default useArticleCategoryFilter;
