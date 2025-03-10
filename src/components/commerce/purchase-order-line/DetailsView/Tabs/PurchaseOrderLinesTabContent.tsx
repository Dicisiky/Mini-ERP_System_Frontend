import DataTable from "@/components/partials/DataTable/DataTable";
import { TabsContent } from "@/components/ui/tabs";

import { Navigate, useNavigate, useParams } from "react-router";
import Loading from "@/components/partials/Loading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PurchaseOrderState } from "@/entities/PurchaseOrder";
import usePurchaseOrdersLines from "@/hooks/use-purchase-orders-lines";
import PurchaseOrderLineColumnsForHeader from "./PurchaseOrderLineColumnsForHeader";

interface PurchaseOrderLinesTabContentProps {
  purchaseOrderState: PurchaseOrderState;
}

const PurchaseOrderLinesTabContent = ({
  purchaseOrderState,
}: PurchaseOrderLinesTabContentProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Redirect to error page if purchase order ID is undefined
  if (!id) return <Navigate to="/error" />;

  // Fetch purchase order lines for the current purchase order
  const { data, error, isLoading } = usePurchaseOrdersLines(Number(id));

  return (
    <TabsContent value="purchase-order-lines">
      {/* Button to redirect user to add purchase order line form */}
      {!(
        purchaseOrderState === PurchaseOrderState.RECEIVED ||
        purchaseOrderState === PurchaseOrderState.SENT ||
        purchaseOrderState === PurchaseOrderState.CANCELLED ||
        purchaseOrderState === PurchaseOrderState.CONFIRMED
      ) && (
        <div className="pt-1">
          <Button
            variant="outline"
            title="Add a new purchase order line"
            onClick={() =>
              navigate(`/purchase-orders/${id}/purchase-order-lines/new`)
            }
          >
            <PlusIcon />
            Purchase order line
          </Button>
        </div>
      )}

      {error && <Navigate to="/error" />}
      {isLoading && <Loading />}
      {!error && !isLoading && data && (
        <DataTable
          filterTextColumns={["productName"]}
          filterTextPlaceholders={["Search by product name..."]}
          data={data}
          columns={PurchaseOrderLineColumnsForHeader(id)}
        />
      )}
    </TabsContent>
  );
};

export default PurchaseOrderLinesTabContent;
