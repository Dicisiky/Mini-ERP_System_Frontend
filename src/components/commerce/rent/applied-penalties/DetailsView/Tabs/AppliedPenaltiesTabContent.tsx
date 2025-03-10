import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import { TabsContent } from "@/components/ui/tabs";
import { FetchAppliedPenalty } from "@/entities/AppliedPenalty";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AppliedPenaltiesColumnsForRentTab from "./AppliedPenaltiesColumnsForRentTab";
import AppliedPenaltiesColumnsForDeepRentLineTab from "./AppliedPenaltiesColumnsForDeepRentLineTab";
import AppliedPenaltiesColumnsForRentLineTab from "./AppliedPenaltiesColumnsForRentLineTab";
import { RentState } from "@/entities/Rent";

interface AppliedPenaltiesTabContentProps {
  endpoint: string;
  rentState: RentState;
}

const AppliedPenaltiesTabContent = ({
  endpoint,
  rentState,
}: AppliedPenaltiesTabContentProps) => {
  const { id, rentId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!id) return <Loading />;

  const apiClient = new ApiClient<FetchAppliedPenalty>(`${endpoint}/${id}`);
  const { data, error, isLoading } = useQuery({
    queryKey: ["rent-applied-penalties", id],
    queryFn: async () => {
      const response = await apiClient.getAll();

      const result = response.map((ap) => ({
        ...ap,
        articleName: ap.rentLine.article.name,
        penaltyDescription: ap.penalty.penaltyTypeDescription,
        penaltyAmount: ap.penalty.price,
        rentLineId: ap.rentLine.rentLineId,
      }));

      return result;
    },
    staleTime: ms("24h"),
  });

  if (error) return <Navigate to="/error" />;

  return (
    <TabsContent value="applied-penalties">
      {/* ########### Button to redirect user to add new penalty form ################# */}
      {!(
        rentState === RentState.RETURNED ||
        rentState === RentState.CANCELLED ||
        rentState === RentState.CONFIRMED
      ) && (
        <div className="pt-1">
          <Button
            variant="outline"
            title="Apply a new penalty"
            onClick={() =>
              pathname.includes("rents")
                ? id && !rentId
                  ? navigate(`/rents/${id}/applied-penalties/new`)
                  : navigate(
                      `/rents/${rentId}/rent-lines/${id}/applied-penalties/new`
                    )
                : navigate(`/rent-lines/${id}/applied-penalties/new`)
            }
          >
            <PlusIcon />
            Apply penalty
          </Button>
        </div>
      )}
      {isLoading && <Loading />}
      {!error && !isLoading && data && (
        <DataTable
          filterTextColumns={["articleName"]}
          filterTextPlaceholders={["Search by article name..."]}
          data={data}
          columns={
            pathname.includes("rents")
              ? id && !rentId
                ? AppliedPenaltiesColumnsForRentTab(id)
                : AppliedPenaltiesColumnsForDeepRentLineTab(rentId, id)
              : AppliedPenaltiesColumnsForRentLineTab(id)
          }
        />
      )}
    </TabsContent>
  );
};

export default AppliedPenaltiesTabContent;
