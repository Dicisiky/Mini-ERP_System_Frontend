import DataTable from "../../partials/DataTable/DataTable";
import { Navigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import StockColumns from "./StockColumns";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import Stock, { NormalizedStock } from "@/entities/Stock";
import { toast } from "react-toastify";
import ms from "ms";
import { useEffect, useState } from "react";
import useCategories from "@/hooks/use-categories";
import EnumDescription from "@/entities/EnumDescription";

const apiClient = new ApiClient<Stock>("/stocks");

const StockDataTable = () => {
  const [normalizedStockData, setNormalizedStockData] = useState<
    NormalizedStock[] | undefined
  >([]);
  const [categoriesTypeOptions, setCategoriesTypeOption] = useState<
    EnumDescription[]
  >([]);

  const { data: categories } = useCategories();

  const { data, error, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      try {
        return await apiClient.getAll();
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    staleTime: ms("24h"),
  });

  useEffect(() => {
    if (categories) {
      setCategoriesTypeOption(
        categories.map((item) => ({
          value: item.name,
          label: item.name,
        }))
      );
    }
  }, [categories]);

  useEffect(() => {
    if (data) {
      setNormalizedStockData(
        data.map((item) => ({
          ...item,
          articleName: item.article.name,
          articleCategory: item.article.categoryid.name,
        }))
      );
    }
  }, [data]);

  return (
    <div className="container mx-auto py-10">
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && normalizedStockData && (
        <div className="w-full overflow-x-auto">
          <DataTable
            filterTextColumns={["articleName"]}
            filterTextPlaceholders={["Search by article name..."]}
            filterEnumColumns={["articleCategory"]}
            filterEnumPlaceholders={["Filter by article category..."]}
            enums={categoriesTypeOptions}
            columns={StockColumns}
            data={normalizedStockData}
          />
        </div>
      )}
    </div>
  );
};

export default StockDataTable;
