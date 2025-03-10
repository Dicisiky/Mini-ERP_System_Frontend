import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import useRentLines from "@/hooks/use-rent-lines";
import RentLineColumns from "./RentLineColumns";
import { rentStateOptions } from "@/entities/Rent";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const RentLineDataTable = () => {
  const { data, error, isLoading } = useRentLines();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new rent line"
        onClick={() => navigate(`/rent-lines/new`)}
      >
        <PlusIcon />
        New rent line
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full md:!max-w-screen-lg xl:min-w-full overflow-x-auto">
          <DataTable
            filterTextColumns={["customerName", "articleName"]}
            filterTextPlaceholders={[
              "Search by customer name...",
              "Search by article name...",
            ]}
            filterEnumColumns={["rentState"]}
            filterEnumPlaceholders={["Filter by status..."]}
            enums={rentStateOptions}
            columns={RentLineColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default RentLineDataTable;
