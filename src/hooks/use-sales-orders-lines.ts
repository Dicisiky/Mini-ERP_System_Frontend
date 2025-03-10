import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const useSalesOrdersLines = (salesOrderId?: number) => {
  const apiClient = new ApiClient<FetchSalesOrderLineResponse>(
    salesOrderId
      ? `/sales-order-lines/sales-order/${salesOrderId}`
      : "/sales-order-lines"
  );
  return useQuery({
    queryKey: salesOrderId
      ? ["sales-order-lines", salesOrderId]
      : ["sales-order-lines"],
    queryFn: async () => {
      try {
        const response = salesOrderId
          ? await apiClient.getAll()
          : await apiClient.getAll();

        const result = response.map((sol) => ({
          ...sol,
          salesOrderId: sol.salesOrder.salesOrderId,
          articleName: sol.article.name,
          vatRate: sol.article.vatid.percent,
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

export default useSalesOrdersLines;
