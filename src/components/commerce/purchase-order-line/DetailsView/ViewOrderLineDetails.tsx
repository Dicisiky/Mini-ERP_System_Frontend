import DetailGrid from "@/components/partials/DetailGrid";
import PageSection from "@/components/partials/PageSection";
import OrderLineButtons from "./OrderLineButtons";
import Loading from "@/components/partials/Loading";
import { Navigate, useParams } from "react-router";
import ms from "ms";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";
import { useIsMobile } from "@/hooks/use-mobile";
import PurchaseOrderLineViewMobileColumns from "./OrderLineColumnsMobile";
import PurchaseOrderLineViewDesktopColumns from "./OrderLineColumnsDesktop";

const ViewPurchaseOrderLineDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) return <Loading />;

  const apiClient = new ApiClient<FetchPurchaseOrderLineResponse>(
    "/purchase-order-lines"
  );

  const {
    data: purchaseOrderLine,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["purchase-order-line", id],
    queryFn: async () => {
      const response = await apiClient.getById(id);
      const { article, purchaseOrder } = response;
      return {
        ...response,
        articleName: article.name,
        purchaseOrderId: purchaseOrder.purchaseOrderId,
        purchaseOrderState: purchaseOrder.purchaseOrderStateDescription,
        supplierName: purchaseOrder.supplierId.name,
        vatRate: article.vatid.percent,
      };
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <PageSection className="flex flex-col gap-4 max-w-6xl xl:min-w-full">
      {isLoading && <Loading />}
      {!error &&
        !isLoading &&
        purchaseOrderLine &&
        purchaseOrderLine.purchaseOrderLineId && (
          <>
            <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
              <DetailGrid
                columns={
                  isMobile
                    ? PurchaseOrderLineViewMobileColumns
                    : PurchaseOrderLineViewDesktopColumns
                }
                data={purchaseOrderLine}
              />
              <OrderLineButtons
                purchaseOrderState={purchaseOrderLine.purchaseOrder.state}
                purchaseOrderId={purchaseOrderLine.purchaseOrderId}
                purchaseOrderLineId={purchaseOrderLine.purchaseOrderLineId}
              />
            </div>
          </>
        )}
    </PageSection>
  );
};

export default ViewPurchaseOrderLineDetails;
