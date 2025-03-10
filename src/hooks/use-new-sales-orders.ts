import {
  FetchSalesOrderResponse,
  SalesOrderState,
} from "@/entities/SalesOrder";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchSalesOrderResponse>("/sales-orders");

const useNewSalesOrders = () => {
  return useQuery({
    queryKey: ["sales-orders-new"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();
        const filteredResponse = response.filter(
          (so) => so.state === SalesOrderState.NEW
        );
        const result = filteredResponse.map((r) => ({
          ...r,
          customerName: r.customerId.name,
        }));

        return result;
      } catch (error: any) {
        toast.error("Sales orders could not be load.");
        console.log(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useNewSalesOrders;
