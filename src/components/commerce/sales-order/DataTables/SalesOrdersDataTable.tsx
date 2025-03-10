import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import SalesOrderColumns from "./SalesOrdersColumns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import useSalesOrders from "@/hooks/use-sales-orders";
import { salesOrderStateOptions } from "@/entities/SalesOrder";

const SalesOrderDataTable = () => {
  const { data, error, isLoading } = useSalesOrders();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new sales order"
        onClick={() => navigate(`/sales-orders/new`)}
      >
        <PlusIcon />
        New order
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["customerName"]}
            filterTextPlaceholders={["Search by customer name..."]}
            filterEnumColumns={["salesOrderStateDescription"]}
            filterEnumPlaceholders={["Filter by order status..."]}
            enums={salesOrderStateOptions}
            columns={SalesOrderColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default SalesOrderDataTable;
