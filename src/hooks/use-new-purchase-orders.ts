import {
  FetchPurchaseOrderResponse,
  PurchaseOrderState,
} from "@/entities/PurchaseOrder";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchPurchaseOrderResponse>("/purchase-orders");

const useNewPurchaseOrders = () => {
  return useQuery({
    queryKey: ["purchase-orders-new"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();
        const filteredResponse = response.filter(
          (po) => po.state === PurchaseOrderState.NEW
        );
        const result = filteredResponse.map((r) => ({
          ...r,
          supplierName: r.supplierId.name,
        }));

        return result;
      } catch (error: any) {
        toast.error("Purchase orders could not be loaded.");
        console.log(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useNewPurchaseOrders;
