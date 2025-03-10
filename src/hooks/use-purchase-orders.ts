import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchPurchaseOrderResponse>("/purchase-orders");

const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();

        return response.map((po) => ({
          ...po,
          supplierName: po.supplierId.name,
        }));
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default usePurchaseOrders;
