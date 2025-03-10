import DataTable from "../../partials/DataTable/DataTable";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import PenaltiesColumns from "./PenaltiesColumns";
import usePenalties from "@/hooks/use-penalties";
import { penaltyTypeOptions } from "@/entities/Penalty";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const PenaltiesDataTable = () => {
  const { data, error, isLoading } = usePenalties();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new penalty"
        onClick={() => navigate(`/penalties/new`)}
      >
        <PlusIcon />
        New penalty
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto">
          <DataTable
            filterEnumColumns={["penaltyTypeDescription"]}
            filterEnumPlaceholders={["Filter by penalty type..."]}
            enums={penaltyTypeOptions}
            columns={PenaltiesColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default PenaltiesDataTable;
