import DataTable from "../../partials/DataTable/DataTable";
import VatRatesColumns from "./VatRatesColumns";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import useVatRates from "@/hooks/use-vatrates";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const VatRatesDataTable = () => {
  const { data, error, isLoading } = useVatRates();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new VAT rate"
        className="mb-4"
        onClick={() => navigate(`/vat-rates/new`)}
      >
        <PlusIcon />
        New VAT rate
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto">
          <DataTable columns={VatRatesColumns} data={data} />
        </div>
      )}
    </div>
  );
};

export default VatRatesDataTable;
