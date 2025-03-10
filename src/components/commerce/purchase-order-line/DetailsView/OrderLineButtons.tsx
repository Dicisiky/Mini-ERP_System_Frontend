import DeleteDialog from "@/components/partials/DeleteDialog";
import { Button } from "@/components/ui/button";
import { PurchaseOrderState } from "@/entities/PurchaseOrder";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface PurchaseOrderLineButtonsProps {
  purchaseOrderState: PurchaseOrderState;
  purchaseOrderLineId: number;
  purchaseOrderId?: number;
}

const PurchaseOrderLineButtons = ({
  purchaseOrderState,
  purchaseOrderLineId,
  purchaseOrderId,
}: PurchaseOrderLineButtonsProps) => {
  const navigate = useNavigate();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {purchaseOrderState === PurchaseOrderState.NEW && (
        <Button
          onClick={() =>
            purchaseOrderId
              ? navigate(
                  `/purchase-orders/${purchaseOrderId}/purchase-order-lines/update/${purchaseOrderLineId}`
                )
              : navigate(`/purchase-order-lines/update/${purchaseOrderLineId}`)
          }
          title="Edit purchase order line"
          variant="outline"
        >
          <PenIcon /> Edit
        </Button>
      )}
      {(purchaseOrderState === PurchaseOrderState.NEW ||
        purchaseOrderState === PurchaseOrderState.RECEIVED ||
        purchaseOrderState === PurchaseOrderState.CANCELLED) && (
        <Button
          onClick={() => setDeleteOpen(true)}
          title="Delete purchase order line"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[
            ["purchase-orders"],
            ["purchase-order"],
            ["purchase-order-lines"],
          ]}
          removeQueryKeys={[["purchase-order-line", `${purchaseOrderLineId}`]]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/purchase-order-lines/delete/${purchaseOrderLineId}`}
          redirectPath={
            purchaseOrderId
              ? `/purchase-orders/view/${purchaseOrderId}`
              : `/purchase-order-lines/view/${purchaseOrderLineId}`
          }
          onSuccess={() =>
            toast.success(
              <span>
                Purchase order line{" "}
                <span className="font-semibold">{purchaseOrderLineId} </span>
                from purchase order{" "}
                <span className="font-semibold">{purchaseOrderId} </span>
                was successfully deleted.
              </span>
            )
          }
          onError={() =>
            toast.error(
              <span>
                Purchase order line{" "}
                <span className="font-semibold">{purchaseOrderLineId} </span>
                from purchase order{" "}
                <span className="font-semibold">{purchaseOrderId} </span>
                could not be deleted.
              </span>
            )
          }
        />
      )}
    </div>
  );
};

export default PurchaseOrderLineButtons;
