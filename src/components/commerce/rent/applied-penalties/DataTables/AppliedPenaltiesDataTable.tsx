import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import useAppliedPenalties from "@/hooks/use-applied-penalties";
import { Navigate, useNavigate } from "react-router";
import AppliedPenaltiesColumns from "./AppliedPenaltiesColumns";
import { penaltyTypeOptions } from "@/entities/Penalty";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const AppliedPenaltiesDataTable = () => {
  // ############# Fetch the data using a custom hook #############
  const { data, error, isLoading } = useAppliedPenalties();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Apply a penalty"
        onClick={() => navigate(`/applied-penalties/new`)}
      >
        <PlusIcon />
        Apply penalty
      </Button>
      {/* ############# If the data is loading, show a Loading spinner */}
      {isLoading && <Loading />}

      {/* If the fetching results in an error, redirect the user to '/error' page (404 Not Found) ############# */}
      {error && <Navigate to="/error" />}

      {/* ############# If the data is successfully fetched, render the data table ############# */}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto">
          <DataTable
            // ############# filterEnumCols = dropdown with some enumerations #############
            // ############# a table can have many enum filters (array of string) #############
            filterEnumColumns={["penaltyDescription"]}
            filterEnumPlaceholders={["Filter by penalty type..."]}
            enums={penaltyTypeOptions}
            // ############# filterTextColumns = columns that can be searched by typing filterTextColumns #############
            // ############# a table can have many searching texts (array of string) #############
            filterTextColumns={["customerName", "articleName"]}
            filterTextPlaceholders={[
              "Search by customer...",
              "Search by article...",
            ]}
            columns={AppliedPenaltiesColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default AppliedPenaltiesDataTable;
