import DetailGrid from "@/components/partials/DetailGrid";
import Loading from "@/components/partials/Loading";
import PageSection from "@/components/partials/PageSection";
import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigate, useParams } from "react-router";
import SalesOrderViewDesktopColumns from "./SalesOrderViewDesktopColumns";
import SalesOrderViewMobileColumns from "./SalesOrderViewMobileColumns";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import ms from "ms";
import SalesOrderTabsList from "./Tabs/SalesOrderTabsList";
import SalesOrderStateButtons from "./SalesOrderStateButtons";

const apiClient = new ApiClient<FetchSalesOrderResponse>("/sales-orders");

const ViewSalesOrderDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) {
    return <Loading />;
  }

  const {
    data: salesOrder,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: async () => {
      const response = await apiClient.getById(Number(id));
      console.log(response);

      return {
        ...response,
        customerName: response.customerId.name,
      };
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <PageSection className="flex flex-col gap-4 max-w-6xl xl:min-w-full">
      {isLoading && <Loading />}
      {salesOrder && salesOrder.salesOrderId && (
        <>
          <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
            <DetailGrid
              data={salesOrder}
              columns={
                isMobile
                  ? SalesOrderViewMobileColumns
                  : SalesOrderViewDesktopColumns
              }
            />

            <SalesOrderStateButtons
              salesOrderId={salesOrder.salesOrderId}
              salesOrderState={salesOrder.state}
            />
          </div>
          <SalesOrderTabsList salesOrderState={salesOrder.state} />
        </>
      )}
    </PageSection>
  );
};

export default ViewSalesOrderDetails;
