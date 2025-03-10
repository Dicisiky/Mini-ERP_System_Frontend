import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const usePurchaseOrderLines = (purchaseOrderId?: number) => {
  const apiClient = new ApiClient<FetchPurchaseOrderLineResponse>(
    purchaseOrderId
      ? `/purchase-order-lines/purchase-order/${purchaseOrderId}`
      : "/purchase-order-lines"
  );

  return useQuery({
    queryKey: purchaseOrderId
      ? ["purchase-order-lines", purchaseOrderId]
      : ["purchase-order-lines"],
    queryFn: async () => {
      try {
        const response = purchaseOrderId
          ? await apiClient.getAll()
          : await apiClient.getAll();

        const result = response.map((pol) => ({
          ...pol,
          purchaseOrderId: pol.purchaseOrder?.purchaseOrderId,
          articleName: pol.article?.name,
          supplierName: pol.purchaseOrder?.supplierName, // Assuming supplierName is needed
          vatRate: pol.article?.vatid?.percent, // If applicable, adjust for VAT rate
        }));

        return result;
      } catch (error: any) {
        console.log(error);
        toast.error("Could not load purchase order lines.");
      }
    },
    staleTime: ms("24h"),
  });
};

export default usePurchaseOrderLines;
