import DetailGrid from "@/components/partials/DetailGrid";
import Loading from "@/components/partials/Loading";
import PageSection from "@/components/partials/PageSection";
import { FetchRentResponse } from "@/entities/Rent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigate, useParams } from "react-router";
import RentViewDesktopColumns from "./RentViewDesktopColumns";
import RentViewMobileColumns from "./RentViewMobileColumns";
import RentOrderTabs from "./Tabs/RentOrderTabsList";
import RentStateButtons from "./RentStateButtons";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/services/api-client";
import ms from "ms";

const apiClient = new ApiClient<FetchRentResponse>("/rents");

const ViewRentDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  if (!id) {
    return <Loading />;
  }

  const {
    data: rent,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["rent", id],
    queryFn: async () => {
      const response = await apiClient.getById(Number(id));
      return {
        ...response,
        customerName: response.customer.name,
      };
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <PageSection className="flex flex-col gap-4 max-w-6xl xl:min-w-full">
      {isLoading && <Loading />}
      {rent && rent.rentId && (
        <>
          <div className="flex flex-col-reverse md:flex-row justify-between gap-2">
            <DetailGrid
              data={rent}
              columns={
                isMobile ? RentViewMobileColumns : RentViewDesktopColumns
              }
            />

            <RentStateButtons rentId={rent.rentId} rentState={rent.state} />
          </div>
          <RentOrderTabs rentState={rent.state} />
        </>
      )}
    </PageSection>
  );
};

export default ViewRentDetails;
