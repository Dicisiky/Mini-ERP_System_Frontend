import DeleteDialog from "@/components/partials/DeleteDialog";
import StateChangeButton from "@/components/partials/StateChangeButton";
import { Button } from "@/components/ui/button";
import {
  FetchPurchaseOrderResponse,
  PurchaseOrderState,
} from "@/entities/PurchaseOrder";
import { FetchPurchaseOrderLineResponse } from "@/entities/PurchaseOrderLine";
import Stock from "@/entities/Stock";
import usePurchaseOrdersLines from "@/hooks/use-purchase-orders-lines";
import ApiClient from "@/services/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface PurchaseOrderStateButtonsProps {
  purchaseOrderId: number;
  purchaseOrderState: PurchaseOrderState;
}

const PurchaseOrderStateButtons = ({
  purchaseOrderId,
  purchaseOrderState,
}: PurchaseOrderStateButtonsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { data: purchaseOrderLines } = usePurchaseOrdersLines(purchaseOrderId);

  const handleSuccessConfirm = async () => {
    toast.success(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        was successfully confirmed.
      </span>
    );

    if (!purchaseOrderLines) return;

    await updateStock(purchaseOrderLines, "incomingQuantity");
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorConfirm = () =>
    toast.warning(
      <span>
        Not enough stock available for purchase order
        <span className="font-semibold"> {purchaseOrderId}. </span>
      </span>
    );

  const handleSuccessReceived = async () => {
    toast.success(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        was successfully received.
      </span>
    );

    if (!purchaseOrderLines) return;

    await updateStock(purchaseOrderLines, "receivedQuantity");
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorReceived = () =>
    toast.error(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        could not be received.
      </span>
    );

  const handleSuccessCancel = async () => {
    toast.success(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        was successfully cancelled.
      </span>
    );
    purchaseOrderLines &&
      (await updateStock(purchaseOrderLines, "canceledQuantity"));
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorCancel = () =>
    toast.error(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        could not be cancelled.
      </span>
    );

  const handleSuccessDelete = () => {
    toast.success(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        was successfully deleted.
      </span>
    );
  };

  const handleErrorDelete = () => {
    toast.error(
      <span>
        Purchase order
        <span className="font-semibold"> {purchaseOrderId} </span>
        could not be deleted.
      </span>
    );
  };

  const updateStock = async (
    purchaseOrderLines: FetchPurchaseOrderLineResponse[],
    operation: keyof Pick<
      Stock,
      | "rentedQuantity"
      | "receivedQuantity"
      | "returnedQuantity"
      | "incomingQuantity"
      | "availableQuantity"
      | "soldQuantity"
      | "canceledQuantity"
    >
  ): Promise<void> => {
    const apiClient = new ApiClient<Stock>("/stocks/update");
    for (const line of purchaseOrderLines) {
      console.log(line.article.articleid);
      await apiClient.update(Number(line.article.articleid), {
        [operation]: line.quantity,
      });
    }
  };

  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {purchaseOrderState === PurchaseOrderState.NEW && (
        <StateChangeButton<FetchPurchaseOrderResponse>
          disabled={purchaseOrderLines?.length === 0}
          endpoint="/purchase-orders/confirm"
          itemId={purchaseOrderId}
          title="Set status to confirmed"
          buttonText="Confirm purchase order"
          queryKeys={[
            ["purchase-order"],
            ["purchase-orders"],
            ["purchase-orders-new"],
            ["purchase-orders-lines"],
            ["purchase-order-line"],
          ]}
          onSuccess={handleSuccessConfirm}
          onError={handleErrorConfirm}
        />
      )}

      {purchaseOrderState === PurchaseOrderState.CONFIRMED && (
        <StateChangeButton<FetchPurchaseOrderResponse>
          endpoint="/purchase-orders/receive"
          itemId={purchaseOrderId}
          title="Set status to received"
          buttonText="Receive purchase order"
          queryKeys={[
            ["purchase-order"],
            ["purchase-orders"],
            ["purchase-orders-new"],
            ["purchase-orders-lines"],
            ["purchase-order-line"],
          ]}
          onSuccess={handleSuccessReceived}
          onError={handleErrorReceived}
        />
      )}

      {(purchaseOrderState === PurchaseOrderState.NEW ||
        purchaseOrderState === PurchaseOrderState.CONFIRMED) && (
        <StateChangeButton<FetchPurchaseOrderResponse>
          variant="outline"
          endpoint="/purchase-orders/cancel"
          itemId={purchaseOrderId}
          title="Set status to cancelled"
          buttonText="Cancel purchase order"
          queryKeys={[
            ["purchase-order"],
            ["purchase-orders"],
            ["purchase-orders-new"],
            ["purchase-orders-lines"],
            ["purchase-order-line"],
          ]}
          onSuccess={handleSuccessCancel}
          onError={handleErrorCancel}
        />
      )}

      {purchaseOrderState === PurchaseOrderState.NEW && (
        <Button
          onClick={() => navigate(`/purchase-orders/update/${purchaseOrderId}`)}
          title="Edit purchase order"
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
          title="Delete purchase order"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[
            ["purchase-orders"],
            ["purchase-orders-new"],
            ["purchase-orders-lines"],
            ["purchase-order-line"],
          ]}
          removeQueryKeys={[
            ["purchase-order", `${purchaseOrderId}`],
            ["purchase-orders-lines", `${purchaseOrderId}`],
          ]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/purchase-orders/${purchaseOrderId}`}
          redirectPath="/purchase-orders/all"
          onSuccess={handleSuccessDelete}
          onError={handleErrorDelete}
        />
      )}
    </div>
  );
};

export default PurchaseOrderStateButtons;
