import DataTable from "@/components/partials/DataTable/DataTable";
import { TabsContent } from "@/components/ui/tabs";

import { Navigate, useNavigate, useParams } from "react-router";
import RentLineColumnsForRent from "../RentLineColumnsFromRent";
import Loading from "@/components/partials/Loading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { RentState } from "@/entities/Rent";
import useRentLines from "@/hooks/use-rent-lines";

interface RentLinesTabContentProps {
  rentState: RentState;
}

const RentLinesTabContent = ({ rentState }: RentLinesTabContentProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  //  ########### if rent id is undefinet, redirect to error page ###########
  if (!id) return <Navigate to="/error" />;

  // ############ fetch rent lines for the current rent order ############

  const { data, error, isLoading } = useRentLines(Number(id));

  return (
    <TabsContent value="rent-lines">
      {/* ########### Button to redirect user to add rent line form ################# */}
      {!(
        rentState === RentState.RETURNED ||
        rentState === RentState.SENT ||
        rentState === RentState.CANCELLED ||
        rentState === RentState.CONFIRMED
      ) && (
        <div className="pt-1">
          <Button
            variant="outline"
            title="Add a new rent line"
            onClick={() => navigate(`/rents/${id}/rent-lines/new`)}
          >
            <PlusIcon />
            Rent line
          </Button>
        </div>
      )}

      {error && <Navigate to="/error" />}
      {isLoading && <Loading />}
      {!error && !isLoading && data && (
        <DataTable
          filterTextColumns={["articleName"]}
          filterTextPlaceholders={["Search by article name..."]}
          data={data}
          columns={RentLineColumnsForRent(id)}
        />
      )}
    </TabsContent>
  );
};

export default RentLinesTabContent;
