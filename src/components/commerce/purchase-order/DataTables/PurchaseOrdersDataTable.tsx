import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import PurchaseOrderColumns from "./PurchaseOrdersColumns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { purchaseOrderStateOptions } from "@/entities/PurchaseOrder";
import usePurchaseOrders from "@/hooks/use-purchase-orders";

const PurchaseOrderDataTable = () => {
  const { data, error, isLoading } = usePurchaseOrders();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new purchase order"
        onClick={() => navigate(`/purchase-orders/new`)}
      >
        <PlusIcon />
        New order
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto px-2">
          <DataTable
            filterTextColumns={["supplierName"]}
            filterTextPlaceholders={["Search by supplier name..."]}
            filterEnumColumns={["purchaseOrderStateDescription"]}
            filterEnumPlaceholders={["Filter by order status..."]}
            enums={purchaseOrderStateOptions}
            columns={PurchaseOrderColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderDataTable;
