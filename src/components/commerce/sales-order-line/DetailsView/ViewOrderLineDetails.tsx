import DetailGrid from "@/components/partials/DetailGrid";
import PageSection from "@/components/partials/PageSection";
import OrderLineButtons from "./OrderLineButtons";
import Loading from "@/components/partials/Loading";
import { Navigate, useParams } from "react-router";
import ms from "ms";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";
import { useIsMobile } from "@/hooks/use-mobile";
import SalesOrderLineViewDesktopColumns from "./OrderLineColumnsDesktop";
import SalesOrderLineViewMobileColumns from "./OrderLineColumnsMobile";

const ViewOrderLineDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) return <Loading />;

  // ############ fetch rent lines for the current rent order ############
  const apiClient = new ApiClient<FetchSalesOrderLineResponse>(
    "/sales-order-lines"
  );

  const {
    data: salesOrderLine,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sales-order-line", id],
    queryFn: async () => {
      const response = await apiClient.getById(id);
      const { article, salesOrder } = response;
      return {
        ...response,
        articleName: article.name,
        salesOrderId: salesOrder.salesOrderId,
        salesOrderState: salesOrder.salesOrderStateDescription,
        customerName: salesOrder.customerId.name,
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
        salesOrderLine &&
        salesOrderLine.salesOrderLineId && (
          <>
            <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
              <DetailGrid
                columns={
                  isMobile
                    ? SalesOrderLineViewMobileColumns
                    : SalesOrderLineViewDesktopColumns
                }
                data={salesOrderLine}
              />
              <OrderLineButtons
                salesOrderState={salesOrderLine.salesOrder.state}
                salesOrderId={salesOrderLine.salesOrderId}
                salesOrderLineId={salesOrderLine.salesOrderLineId}
              />
            </div>
          </>
        )}
    </PageSection>
  );
};

export default ViewOrderLineDetails;
