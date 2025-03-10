import PageSection from "@/components/partials/PageSection";
import { FetchRentLineResponse } from "@/entities/RentLine";
import { useIsMobile } from "@/hooks/use-mobile";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";
import ms from "ms";
import DetailGrid from "@/components/partials/DetailGrid";
import Loading from "@/components/partials/Loading";
import RentLineViewMobileColumns from "./RentLineViewMobileColumns";
import RentLineViewDesktopColumns from "./RentLineViewDesktopColumns";
import RentLineTabsList from "./Tabs/RentLineTabsList";
import RentLineButtons from "./RentLineButtons";

const RentLineDetailsView = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) return <Loading />;

  // ############ fetch rent lines for the current rent order ############
  const apiClient = new ApiClient<FetchRentLineResponse>("/rentlines");

  const {
    data: rentLine,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["rent-order-line", id],
    queryFn: async () => {
      const response = await apiClient.getById(id);
      const { article, rent } = response;
      return {
        ...response,
        articleName: article.name,
        rentId: rent.rentId,
        rentState: rent.rentStateDescription,
        customerName: rent.customer.name,
        VatRate: article.vatid.percent,
        period: rent.period,
      };
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <PageSection className="flex flex-col gap-4 max-w-6xl xl:min-w-full">
      {isLoading && <Loading />}
      {!error && !isLoading && rentLine && rentLine.rentLineId && (
        <>
          <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
            <DetailGrid
              columns={
                isMobile
                  ? RentLineViewMobileColumns
                  : RentLineViewDesktopColumns
              }
              data={rentLine}
            />
            <RentLineButtons
              rentState={rentLine.rent.state}
              rentId={rentLine.rentId}
              rentLineId={rentLine.rentLineId}
            />
          </div>
          <RentLineTabsList rentState={rentLine.rent.state} />
        </>
      )}
    </PageSection>
  );
};

export default RentLineDetailsView;
