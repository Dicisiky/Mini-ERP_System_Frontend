import DetailGrid from "@/components/partials/DetailGrid";
import Loading from "@/components/partials/Loading";
import PageSection from "@/components/partials/PageSection";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import ms from "ms";
import PurchaseOrderStateButtons from "./PurchaseOrderStateButtons";
import PurchaseOrderViewDesktopColumns from "./PurchaseOrderViewDesktopColumns";
import PurchaseOrderViewMobileColumns from "./PurchaseOrderViewMobileColumns";
import PurchaseOrderTabsList from "./Tabs/PurchaseOrderTabLists";

const apiClient = new ApiClient<FetchPurchaseOrderResponse>("/purchase-orders");

const ViewPurchaseOrderDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) {
    return <Loading />;
  }

  const {
    data: purchaseOrder,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["purchase-order", id],
    queryFn: async () => {
      const response = await apiClient.getById(Number(id));
      console.log(response);

      return {
        ...response,
        supplierName: response.supplierId.name,
      };
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <PageSection className="flex flex-col gap-4 max-w-6xl xl:min-w-full">
      {isLoading && <Loading />}
      {purchaseOrder && purchaseOrder.purchaseOrderId && (
        <>
          <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
            <DetailGrid
              data={purchaseOrder}
              columns={
                isMobile
                  ? PurchaseOrderViewMobileColumns
                  : PurchaseOrderViewDesktopColumns
              }
            />

            <PurchaseOrderStateButtons
              purchaseOrderId={purchaseOrder.purchaseOrderId}
              purchaseOrderState={purchaseOrder.state}
            />
          </div>
          <PurchaseOrderTabsList purchaseOrderState={purchaseOrder.state} />
        </>
      )}
    </PageSection>
  );
};

export default ViewPurchaseOrderDetails;
