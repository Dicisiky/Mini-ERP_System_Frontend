import { Navigate, useNavigate } from "react-router-dom";
import PurchaseOrdersLinesColumns from "./PurchaseOrdersLinesColumns"; // Assuming you have created this
import usePurchaseOrdersLines from "@/hooks/use-purchase-orders-lines"; // Assuming you have a hook for fetching purchase order lines
import Loading from "@/components/partials/Loading";
import DataTable from "@/components/partials/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const PurchaseOrderLineDataTable = () => {
  const { data, error, isLoading } = usePurchaseOrdersLines();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10 px-2">
      <Button
        variant="default"
        title="Add a new purchase order line"
        onClick={() => navigate(`/purchase-order-lines/new`)}
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
            columns={PurchaseOrdersLinesColumns}
            data={data}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderLineDataTable;
