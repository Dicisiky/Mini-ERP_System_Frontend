import { Navigate, useNavigate } from "react-router-dom";
import SalesOrdersLinesColumns from "./SalesOrdersLinesColumns";
import useSalesOrdersLines from "@/hooks/use-sales-orders-lines";
import Loading from "@/components/partials/Loading";
import DataTable from "@/components/partials/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const SalesOrderLineDataTable = () => {
  const { data, error, isLoading } = useSalesOrdersLines();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10 px-2">
      <Button
        variant="default"
        title="Add a new sales order line"
        onClick={() => navigate(`/sales-order-lines/new`)}
      >
        <PlusIcon />
        New order line
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["articleName"]}
            filterTextPlaceholders={["Search by article name"]}
            columns={SalesOrdersLinesColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default SalesOrderLineDataTable;
