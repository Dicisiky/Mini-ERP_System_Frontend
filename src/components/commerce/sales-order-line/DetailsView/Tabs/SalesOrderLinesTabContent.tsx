import DataTable from "@/components/partials/DataTable/DataTable";
import { TabsContent } from "@/components/ui/tabs";

import { Navigate, useNavigate, useParams } from "react-router";
import Loading from "@/components/partials/Loading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SalesOrderState } from "@/entities/SalesOrder";
import useSalesOrdersLines from "@/hooks/use-sales-orders-lines";
import SalesOrderLineColumnsForHeader from "./SalesOrderLineColumnsForHeader";

interface SalesOrderLinesTabContentProps {
  salesOrderState: SalesOrderState;
}

const SalesOrderLinesTabContent = ({
  salesOrderState,
}: SalesOrderLinesTabContentProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  //  ########### if rent id is undefinet, redirect to error page ###########
  if (!id) return <Navigate to="/error" />;

  // ############ fetch rent lines for the current rent order ############

  const { data, error, isLoading } = useSalesOrdersLines(Number(id));

  return (
    <TabsContent value="sales-order-lines">
      {/* ########### Button to redirect user to add rent line form ################# */}
      {!(
        salesOrderState === SalesOrderState.DELIVERED ||
        salesOrderState === SalesOrderState.SENT ||
        salesOrderState === SalesOrderState.CANCELLED ||
        salesOrderState === SalesOrderState.CONFIRMED
      ) && (
        <div className="pt-1">
          <Button
            variant="outline"
            title="Add a new sales order line"
            onClick={() =>
              navigate(`/sales-orders/${id}/sales-order-lines/new`)
            }
          >
            <PlusIcon />
            Sales order line
          </Button>
        </div>
      )}

      {error && <Navigate to="/error" />}
      {isLoading && <Loading />}
      {!error && !isLoading && data && (
        <DataTable
          filterTextColumns={["articleName"]}
          filterTextPlaceholders={["Search by article name..."]}
          data={data}
          columns={SalesOrderLineColumnsForHeader(id)}
        />
      )}
    </TabsContent>
  );
};

export default SalesOrderLinesTabContent;
