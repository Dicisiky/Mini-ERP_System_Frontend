import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchSalesOrderResponse>("/sales-orders");

const useSalesOrders = () => {
  return useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();

        return response.map((so) => ({
          ...so,
          customerName: so.customerId.name,
        }));
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useSalesOrders;
