import DeleteDialog from "@/components/partials/DeleteDialog";
import { Button } from "@/components/ui/button";
import { SalesOrderState } from "@/entities/SalesOrder";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface OrderLineButtonsProps {
  salesOrderState: SalesOrderState;
  salesOrderLineId: number;
  salesOrderId?: number;
}

const OrderLineButtons = ({
  salesOrderState,
  salesOrderLineId,
  salesOrderId,
}: OrderLineButtonsProps) => {
  const navigate = useNavigate();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {salesOrderState === SalesOrderState.NEW && (
        <Button
          onClick={() =>
            salesOrderId
              ? navigate(
                  `/sales-orders/${salesOrderId}/sales-order-lines/update/${salesOrderLineId}`
                )
              : navigate(`/sales-order-lines/update/${salesOrderLineId}`)
          }
          title="Edit sales order line"
          variant="outline"
        >
          <PenIcon /> Edit
        </Button>
      )}
      {(salesOrderState === SalesOrderState.NEW ||
        salesOrderState === SalesOrderState.DELIVERED ||
        salesOrderState === SalesOrderState.CANCELLED) && (
        <Button
          onClick={() => setDeleteOpen(true)}
          title="Delete rent line"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[["sales-orders"], ["sales-order"], ["sales-order-lines"]]}
          removeQueryKeys={[["sales-order-line", `${salesOrderLineId}`]]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/sales-order-lines/delete/${salesOrderLineId}`}
          redirectPath={
            salesOrderId
              ? `/sales-orders/view/${salesOrderId}`
              : `/sales-order-lines/view/${salesOrderLineId}`
          }
          onSuccess={() =>
            toast.success(
              <span>
                Sales order line{" "}
                <span className="font-semibold">{salesOrderLineId} </span>
                from sales order{" "}
                <span className="font-semibold">{salesOrderId} </span>
                was succesfully deleted.
              </span>
            )
          }
          onError={() =>
            toast.success(
              <span>
                Sales order line{" "}
                <span className="font-semibold">{salesOrderLineId} </span>
                from sales order{" "}
                <span className="font-semibold">{salesOrderId} </span>
                could not be deleted.
              </span>
            )
          }
        />
      )}
    </div>
  );
};

export default OrderLineButtons;
