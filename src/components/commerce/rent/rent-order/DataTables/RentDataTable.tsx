import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import RentColumns from "./RentColumns";
import useRents from "@/hooks/use-rents";
import { rentStateOptions } from "@/entities/Rent";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const RentDataTable = () => {
  const { data, error, isLoading } = useRents();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new rent order"
        onClick={() => navigate(`/rents/new`)}
      >
        <PlusIcon />
        New order
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto">
          <DataTable
            filterTextColumns={["customerName"]}
            filterTextPlaceholders={["Search by customer name..."]}
            filterEnumColumns={["rentStateDescription"]}
            filterEnumPlaceholders={["Filter by status..."]}
            enums={rentStateOptions}
            columns={RentColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default RentDataTable;
